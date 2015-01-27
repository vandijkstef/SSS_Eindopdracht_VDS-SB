# Server-side scripting in node.js -- Final Assignment Base Application

This photo-sharing application is created by Sem Bakkum and Stef van Dijk.
The created application is the final assignment for Server Side Scripting at CMD @ HvA.

# Features

- Upload photos to filesystem and database
- Show all photos
- Show a specific photo
- Users levels to add restrictions - 1 is standard / 9 is admin

# To be done

- Allow users to register
- Allow photo owners to edit or delete their photo

## Maybe

- Comment with an image

### DB Edits

- Added column 'username' and 'is_user' into comments table
	ALTER TABLE comments ADD username varchar(255)
	ALTER TABLE comments ADD is_user boolean
	ALTER TABLE users ADD user_level int(1)
