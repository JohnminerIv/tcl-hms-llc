require('dotenv').config();
const path = require('path');
const app = require('./app');

require('./controllers/userRoutes')(app);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

if (require.main === module) {
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening at http://localhost:${process.env.PORT}`);
  });
}

module.exports = app;

console.log(`App is listening at http://localhost:${process.env.PORT}/`);
