<h1>🏷️ Project Title</h1>
<h2><strong>Master Table Administration System (Next.js + PostgreSQL)</strong></h2>

<hr>

<h1>🧾 Executive Summary</h1>
<p>
The Master Table Administration System is a highly configurable, generic, and secure CRUD platform designed to manage multiple PostgreSQL master tables using a single UI component and two dynamic API routes. The system auto-discovers table schema, detects primary keys at runtime, and enforces strict table-level security via an allow-list.
</p>
<p>
This report documents the entire journey from problem analysis, database schema structuring, table creation, backend API development, React UI implementation, deployment planning, and security enhancements. The final product delivers a scalable and reusable internal master-data management console suitable for enterprise environments.
</p>

<hr>

<h1>📑 Table of Contents</h1>
<ol>
<li>🏷️ Project Title</li>
<li>🧾 Executive Summary</li>
<li>🧩 Project Overview</li>
<li>🎯 Objectives & Goals</li>
<li>✅ Acceptance Criteria</li>
<li>💻 Prerequisites</li>
<li>⚙️ Installation & Setup</li>
<li>🔗 API Documentation</li>
<li>🖥️ UI / Frontend Details</li>
<li>🔢 Status Codes</li>
<li>🚀 Features</li>
<li>🧱 Tech Stack & Architecture</li>
<li>🛠️ Workflow & Implementation</li>
<li>🧪 Testing & Validation</li>
<li>🔍 Validation Summary</li>
<li>🧰 Verification Tools & Commands</li>
<li>🧯 Troubleshooting & Debugging</li>
<li>🔒 Security & Secrets</li>
<li>☁️ Deployment (Vercel)</li>
<li>⚡ Quick-Start Cheat Sheet</li>
<li>🧾 Usage Notes</li>
<li>🧠 Performance & Optimization</li>
<li>🌟 Enhancements</li>
<li>🧩 Maintenance & Future Work</li>
<li>🏆 Key Achievements</li>
<li>🧮 High-Level Architecture</li>
<li>🗂️ Folder Structure</li>
<li>🧭 Demo Instructions</li>
<li>💡 Summary & Compliance</li>
</ol>

<hr>

<h1>🧩 Project Overview</h1>
<p>
A PostgreSQL-driven admin panel where different master tables such as <code>mast_state</code>, <code>mast_country</code>, <code>mast_status</code>, <code>user_template</code>, etc., can be added, updated, deleted, and searched without creating new UI or API logic. This saves time and eliminates repeated CRUD development for individual tables.
</p>

<hr>

<h1>🎯 Objectives & Goals</h1>
<ul>
<li>Provide a generic admin system for all master tables.</li>
<li>Generate UI dynamically from database schema.</li>
<li>Prevent access to unauthorized tables (allow-listing).</li>
<li>Detect primary keys automatically (numeric & character).</li>
<li>Deploy securely using environment variables.</li>
</ul>

<hr>

<h1>✅ Acceptance Criteria</h1>
<ul>
<li>UI and API should support CRUD for all allowed master tables.</li>
<li>Primary key must be auto-detected at runtime.</li>
<li>User cannot edit primary key values.</li>
<li>Tables should load via dynamic schema fetch.</li>
<li>Search, pagination, and validation must work uniformly.</li>
<li>Unauthorized table access must be blocked.</li>
</ul>

<hr>

<h1>💻 Prerequisites</h1>
<ul>
<li>Node.js 18+</li>
<li>PostgreSQL 12+</li>
<li>Basic SQL knowledge</li>
<li>Environment variable setup (<code>DATABASE_URL</code>)</li>
<li>Next.js, React, Tailwind basic understanding</li>
</ul>

<hr>

<h1>⚙️ Installation & Setup</h1>

<pre><code>git clone &lt;REPO_URL&gt;
cd master-table
npm install

# setup .env
DATABASE_URL="postgres://user:pass@host:5432/db"

npm run dev   # http://localhost:3000
</code></pre>

<hr>

<h1>🔗 API Documentation</h1>

<h2><strong>GET /api/schema?table=TABLE_NAME</strong></h2>
<p>Returns column metadata and primary key.</p>

<h2><strong>GET /api/data?table=TABLE_NAME&limit=&offset=&search=</strong></h2>
<p>Returns paginated records + search filter.</p>

<h2><strong>POST /api/data?table=TABLE_NAME</strong></h2>
<p>Create new row.</p>

<h2><strong>PUT /api/data?table=TABLE_NAME&id=PK</strong></h2>
<p>Update row.</p>

<h2><strong>DELETE /api/data?table=TABLE_NAME&id=PK</strong></h2>
<p>Delete specific row.</p>

<hr>

<h1>🖥️ UI / Frontend</h1>
<p>A single component <code>DataTable.tsx</code> dynamically generates forms and tables using:</p>
<ul>
<li>Fetched schema</li>
<li>Detected primary key</li>
<li>Automatic validation</li>
<li>Visual pagination</li>
<li>Search bar</li>
</ul>

<h2>Where to Change Styles?</h2>
<ul>
<li>Global: <code>app/globals.css</code></li>
<li>Component: <code>components/DataTable.tsx</code> Tailwind classes</li>
<li>Theme edits: <code>tailwind.config.js</code></li>
</ul>

<hr>

<h1>🔢 Status Codes</h1>
<table>
<tr><th>Code</th><th>Description</th></tr>
<tr><td>200</td><td>Request Successful</td></tr>
<tr><td>400</td><td>Bad Request / Invalid Table / Missing ID</td></tr>
<tr><td>404</td><td>Record Not Found</td></tr>
<tr><td>500</td><td>Database / Server Error</td></tr>
</table>

<hr>

<h1>🚀 Features</h1>
<ul>
<li>Schema-driven UI</li>
<li>Dynamic form builder</li>
<li>Strict table allow-listing</li>
<li>Primary key detection logic</li>
<li>Generic CRUD API</li>
<li>Search + pagination</li>
<li>Deployment-ready architecture</li>
</ul>

<hr>

<h1>🧱 Tech Stack & Architecture</h1>

<table>
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Frontend</td><td>Next.js + React + TypeScript + Tailwind</td></tr>
<tr><td>Backend</td><td>Next.js Route Handlers + Node.js</td></tr>
<tr><td>Database</td><td>PostgreSQL</td></tr>
<tr><td>Deployment</td><td>Vercel</td></tr>
</table>

<h3>ASCII Architecture Diagram</h3>

<pre><code>
+------------------ UI ------------------+
| React + Next.js + DataTable Component |
|  |                                    |
|  v                                    |
| /api/data  <-->  /api/schema          |
+-------+----------------+--------------+
        | DB Access (pg Pool)
        v
    [ PostgreSQL ]
    |  mast_*    |
    | user_template |
</code></pre>

<hr>

<h1>🛠️ Workflow & Implementation</h1>
<ol>
<li>Create all master tables in PostgreSQL using proper PK rules.</li>
<li>Add table names to <code>ALLOWED_TABLES</code>.</li>
<li>Implement generic CRUD in <code>/api/data</code>.</li>
<li>Implement dynamic schema fetch in <code>/api/schema</code>.</li>
<li>Build UI with <code>DataTable.tsx</code>.</li>
<li>Test CRUD + search + pagination.</li>
<li>Deploy using Vercel with environment variables.</li>
</ol>

<hr>

<h1>🧪 Testing & Validation</h1>

<table>
<tr>
<th>ID</th><th>Area</th><th>Command/Test</th><th>Expected Output</th><th>Explanation</th>
</tr>
<tr><td>T1</td><td>API Schema</td><td>GET /api/schema?table=mast_country</td><td>column metadata JSON</td><td>Checks allow-list & schema generation</td></tr>
<tr><td>T2</td><td>Pagination</td><td>GET /api/data?limit=5</td><td>5 records + total</td><td>Verifies pagination logic</td></tr>
<tr><td>T3</td><td>Create</td><td>POST valid JSON</td><td>success:true</td><td>Tests insert</td></tr>
<tr><td>T4</td><td>Update</td><td>PUT with id</td><td>updated row JSON</td><td>Checks PK detection</td></tr>
<tr><td>T5</td><td>Delete</td><td>DELETE /api/data?id=PK</td><td>success:true</td><td>Validates deletion</td></tr>
</table>

<hr>

<h1>🔍 Validation Summary</h1>
<ul>
<li>All CRUD functions operate generically.</li>
<li>Only allowed tables are accessible.</li>
<li>Primary keys correctly detected.</li>
<li>UI dynamically adapts to DB structure.</li>
</ul>

<hr>

<h1>🧰 Verification Tools & Command Examples</h1>

<pre><code>curl "http://localhost:3000/api/schema?table=mast_country"
curl "http://localhost:3000/api/data?table=mast_country"
</code></pre>

<hr>

<h1>🧯 Troubleshooting & Debugging</h1>
<ul>
<li>500 error → Check DB connection in <code>.env</code>.</li>
<li>400 error → Table not in <code>ALLOWED_TABLES</code>.</li>
<li>Update not working → PK cannot be altered.</li>
<li>No UI changes appear → Restart: <code>npm run dev</code>.</li>
</ul>

<hr>

<h1>🔒 Security & Secrets</h1>
<ul>
<li>Never commit <code>.env</code>.</li>
<li>Use Vercel encrypted variables.</li>
<li>Allow-list prevents unauthorized table access.</li>
<li>Optional: Implement RBAC in future.</li>
</ul>

<hr>

<h1>☁️ Deployment (Vercel)</h1>
<ol>
<li>Push repo to GitHub</li>
<li>Import into Vercel</li>
<li>Add: <code>DATABASE_URL</code> under Env Variables</li>
<li>Deploy</li>
</ol>

<hr>

<h1>⚡ Quick-Start Cheat Sheet</h1>

<pre><code>npm install
echo "DATABASE_URL=..." > .env
npm run dev
</code></pre>

<hr>

<h1>🧾 Usage Notes</h1>
<ul>
<li>To add new master table: Create SQL + add to allow-list + UI table list.</li>
<li>PK column must exist and be unique.</li>
<li>Search is substring, not regEx.</li>
</ul>

<hr>

<h1>🧠 Performance & Optimization</h1>
<ul>
<li>Use pagination to limit results.</li>
<li>Use DB indexing on frequently searched columns.</li>
<li>Consider caching `/api/schema` in production.</li>
</ul>

<hr>

<h1>🌟 Enhancements & Features (Future)</h1>
<ul>
<li>Role-based authentication</li>
<li>Audit logs</li>
<li>Field-level permissions</li>
<li>Data import/export</li>
<li>Column-based advanced filtering</li>
</ul>

<hr>

<h1>🧩 Maintenance & Future Work</h1>
<ul>
<li>Keep DB + allow-list in sync.</li>
<li>Add monitoring for DB failures.</li>
<li>Test CRUD after every schema update.</li>
</ul>

<hr>

<h1>🏆 Key Achievements</h1>
<ul>
<li>One UI for all master tables</li>
<li>Automatic PK detection</li>
<li>Enterprise-grade DB schema work</li>
<li>Secure Deployment & Whitelisting</li>
<li>Reusable CRUD architecture</li>
</ul>

<hr>

<h1>🧮 High-Level Architecture</h1>

<pre><code>
React UI ----> Next.js API ----> PostgreSQL
   ^                                |
   |-----> Dynamic Schema <---------|
</code></pre>

<hr>

<h1>🗂️ Folder Structure</h1>

<pre><code>
MASTER-TABLE/
├─ app/
│  ├─ api/
│  │  ├─ data/route.ts
│  │  └─ schema/route.ts
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  └─ DataTable.tsx
├─ lib/
│  ├─ db.ts
│  └─ tables.ts
├─ public/
├─ .env
└─ package.json
</code></pre>

<hr>

<h1>🧭 How to Demonstrate Live</h1>
<ol>
<li>Open the app</li>
<li>Choose a master table</li>
<li>Create → Edit → Delete any record</li>
<li>Show search + pagination</li>
<li>Open Dev Tools → Network → Confirm API calls</li>
</ol>

<hr>

<h1>💡 Summary, Closure & Compliance</h1>
<p>
The Master Table Administration System successfully delivers a scalable, secure, schema-driven CRUD application built without hard-coded forms or routes. The architecture complies with enterprise standards, provides production deployment workflows, and demonstrates robust engineering design for future extensibility.
</p>

</body>
</html>
