// index.js
// enable CORS so that your API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204


// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));


// serve homepage
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// sample API endpoint
app.get('/api/hello', (req, res) => {
res.json({ greeting: 'hello API' });
});


// Timestamp microservice endpoint
app.get('/api/:date?', (req, res) => {
const { date } = req.params;


// If no date parameter, return current time
if (!date) {
const now = new Date();
return res.json({ unix: now.getTime(), utc: now.toUTCString() });
}


// If date contains only digits (possible unix timestamp in ms or seconds)
// Accept both milliseconds and seconds. If it's all digits and length === 13, treat as ms
// If it's all digits and length === 10, treat as seconds (convert to ms)
const isDigits = /^\d+$/.test(date);
let parsedDate;


if (isDigits) {
// Convert to number
const num = Number(date);
// If it's in seconds (10 digits) convert to ms
parsedDate = new Date(num);


// Common FreeCodeCamp tests use milliseconds string (like "1451001600000")
// But also accept seconds; if num seems too small (< 1e12) treat as seconds
if (num < 1e12) {
parsedDate = new Date(num * 1000);
}
} else {
// Non-numeric date string — pass directly to Date
parsedDate = new Date(date);
}


if (parsedDate.toString() === 'Invalid Date') {
return res.json({ error: 'Invalid Date' });
}


return res.json({ unix: parsedDate.getTime(), utc: parsedDate.toUTCString() });
});


// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, () => {
console.log('Your app is listening on port ' + listener.address().port);
});


module.exports = app; // export for testing if needed