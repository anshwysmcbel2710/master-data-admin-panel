import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';
  const search = searchParams.get('search') || '';

  if (!table) {
    return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
  }

  try {
    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
    const total = parseInt(countResult.rows[0].count);

    // Get data with search
    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];
    
    if (search) {
      query += ` WHERE CAST(* AS TEXT) ILIKE $1`;
      params.push(`%${search}%`);
    }
    
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return NextResponse.json({
      data: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');

  if (!table) {
    return NextResponse.json({ error: 'Table name is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const columns = Object.keys(body).join(', ');
    const values = Object.values(body);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !id) {
    return NextResponse.json({ error: 'Table name and ID are required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const entries = Object.entries(body);
    const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
    const values = entries.map(([, value]) => value);

    // Get primary key column name
    const pkQuery = `
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass AND i.indisprimary
    `;
    const pkResult = await pool.query(pkQuery, [table]);
    const pkColumn = pkResult.rows[0]?.attname || 'id';

    const query = `UPDATE ${table} SET ${setClause} WHERE ${pkColumn} = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table');
  const id = searchParams.get('id');

  if (!table || !id) {
    return NextResponse.json({ error: 'Table name and ID are required' }, { status: 400 });
  }

  try {
    // Get primary key column name
    const pkQuery = `
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass AND i.indisprimary
    `;
    const pkResult = await pool.query(pkQuery, [table]);
    const pkColumn = pkResult.rows[0]?.attname || 'id';

    const query = `DELETE FROM ${table} WHERE ${pkColumn} = $1`;
    await pool.query(query, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
