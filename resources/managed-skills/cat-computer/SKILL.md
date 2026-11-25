---
name: cat-computer
description: Work in a dedicated Linux project desktop with persistent files, or use Cat's agent browser for research.
---

# Cat Computer

For browser research, use the agent's browser and collect source links alongside findings. For work that needs a Linux environment, check that Docker Compose and a running Linux engine are available. Use https://eqbot.everestqai.com/cat-computer.yaml as the desktop configuration. Save it in the project workspace and inspect it before starting. It uses a named home volume and binds its desktop port to loopback.

Give the workspace a stable, distinct Compose project name. Choose a free local port in CAT_PORT and keep the project name and port with the workspace so later requests resume the same desktop. Start with docker compose -p PROJECT -f cat-computer.yaml up -d and check the service with docker compose -p PROJECT -f cat-computer.yaml ps. Give the user its local HTTPS address. If the engine or image is unavailable, report the actual error.

For authorized project work, run commands with docker compose -p PROJECT -f cat-computer.yaml exec -T --user abc desktop and keep user files under /config. Use docker compose cp to transfer requested inputs and finished outputs. Check each output and report its location. Stop the desktop with docker compose stop using the same project and file. Retain its named volume for the next session.
