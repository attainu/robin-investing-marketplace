const app = require("./app");

const domainName = process.env.DOMAIN_NAME || `http://localhost:8080`;
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server connected at ${domainName}`));
