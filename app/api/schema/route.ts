// app/api/schema/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Whitelist to prevent fetching system tables
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    if (!table || !ALLOWED_TABLES.has(table)) {
      return NextResponse.json(
        { error: 'Invalid or missing table name' },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        c.column_name,
        c.data_type,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale,
        c.is_nullable,
        c.column_default,
        (tc.constraint_type = 'PRIMARY KEY') AS is_primary_key
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage k
        ON c.table_name = k.table_name
       AND c.column_name = k.column_name
      LEFT JOIN information_schema.table_constraints tc
        ON k.constraint_name = tc.constraint_name
       AND tc.table_name = c.table_name
       AND tc.constraint_type = 'PRIMARY KEY'
      WHERE c.table_name = $1
      ORDER BY c.ordinal_position;
    `;

    const result = await pool.query(query, [table]);

    return NextResponse.json({ columns: result.rows });

  } catch (error: any) {
    console.error('Database error (schema):', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
