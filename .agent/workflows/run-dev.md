---
description: Run Seatwise development server locally
---
// turbo-all

# Run Seatwise Development Server

1. Start a local HTTP server:
```bash
npx http-server . -p 8080 -c-1 --cors
```

2. Open in browser:
- Landing page: http://localhost:8080/index.html  
- Authentication: http://localhost:8080/auth.html
- Merge files: http://localhost:8080/marge/marge.html

3. Or use VS Code Live Server (port 5503 configured in .vscode/settings.json)
