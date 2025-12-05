// app/api/data/route.ts 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Hard whitelist
const ALLOWED_TABLES = new Set([
  'mast_country',
  'mast_region',
  'mast_state',
  'mast_district',
  'mast_task',
  'mast_ability',
  'mast_activity',
  'mast_aptitude',
  'mast_contact',
  'mast_data',
  'mast_industry',
  'mast_knowledge',
  'mast_lang',
  'mast_leadtype',
  'mast_outlook',
  'mast_pathway',
  'mast_pincode',
  'mast_place',
  'mast_preference',
  'mast_sector',
  'mast_skills',
  'mast_status',
  'mast_stem',
  'mast_technology',
  'mast_tools',
  'mast_trait',
  'mast_zone',
  'mast_user',
  'user_template'
]);

// Detect PK name & type
async function getPrimaryKey(table: string) {
  const pkQuery = `
      SELECT a.attname AS column, t.typname AS type
      FROM pg_index i
      JOIN pg_attribute a
          ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      JOIN pg_type t
          ON a.atttypid = t.oid
      WHERE i.indrelid = $1::regclass AND i.indisprimary;
  `;
  const result = await pool.query(pkQuery, [table]);
  return result.rows[0] ?? { column: 'id', type: 'text' };
}

// ======================= GET =======================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const limit = Number(searchParams.get('limit') ?? '10');
    const offset = Number(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search') ?? '';

    if (!table || !ALLOWED_TABLES.has(table)) {
      return NextResponse.json({ error: 'Invalid or missing table name' }, { status: 400 });
    }

    const total = Number((await pool.query(`SELECT COUNT(*) FROM ${table}`)).rows[0].count);

    let query = `SELECT * FROM ${table}`;
    const params: any[] = [];

    if (search) {
      query += ` WHERE CAST(row_to_json(${table}) AS TEXT) ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return NextResponse.json({ data: result.rows, total, limit, offset });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ======================= POST =======================
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    if (!table || !ALLOWED_TABLES.has(table)) {
      return NextResponse.json({ error: 'Invalid or missing table name' }, { status: 400 });
    }

    const body = await request.json();
    const columns = Object.keys(body);
    const values = Object.values(body);

    if (columns.length === 0) {
      return NextResponse.json({ error: 'No values provided' }, { status: 400 });
    }

    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(query, values);
    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ======================= PUT (Editable PK) =======================
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const oldId = searchParams.get('id');

    if (!table || !ALLOWED_TABLES.has(table) || oldId == null) {
      return NextResponse.json({ error: 'Table name and id are required' }, { status: 400 });
    }

    const body = await request.json();
    const entries = Object.entries(body);
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No values provided' }, { status: 400 });
    }

    const { column: pkColumn, type: pkType } = await getPrimaryKey(table);
    const castedOldId = ['int2', 'int4', 'int8'].includes(pkType) ? Number(oldId) : oldId;

    // Convert updates to SQL
    const setClause = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
    const values = entries.map(([, v]) => v);

    // Use original PK for WHERE (even if user changes PK)
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${pkColumn} = $${values.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, castedOldId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: `No row in ${table} where ${pkColumn} = ${oldId}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ======================= DELETE =======================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');

    if (!table || !ALLOWED_TABLES.has(table) || id == null) {
      return NextResponse.json({ error: 'Table name and id are required' }, { status: 400 });
    }

    const { column: pkColumn, type: pkType } = await getPrimaryKey(table);
    const castedId = ['int2', 'int4', 'int8'].includes(pkType) ? Number(id) : id;

    const result = await pool.query(`DELETE FROM ${table} WHERE ${pkColumn} = $1`, [castedId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: `No row in ${table} where ${pkColumn} = ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
