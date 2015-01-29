# Server-side scripting in node.js -- Final Assignment Base Application

This photo-sharing application is created by Sem Bakkum and Stef van Dijk.
The created application is the final assignment for Server Side Scripting at CMD @ HvA.

# Features

- Upload photos to filesystem and database
- Show all photos
- Show a specific photo
- Users levels to add restrictions - 1 is standard / 9 is admin
- Users can register
- Users can change the caption or delete their photo
- There is an admin that can edit all photos (admin@admin.com / admin)

### DB Edits

Database is altered. The file in the database dir should help you out.

These are all edits:

	ALTER TABLE comments ADD username varchar(255)
	ALTER TABLE comments ADD is_user boolean
	ALTER TABLE users ADD user_level int(1)
