import express, { Request, Response } from 'express';
import ejs from 'ejs';
import * as path from 'path';

const app = express();
const appPort = process.env.APP_PORT || 3000; // Use APP_PORT env var or default to 3000

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(express.json());

// Define the template path
const templatePath = path.join(__dirname, 'views', 'template.html');

// Pre-render the content from the template
const templateContent = ejs.compileFile(templatePath);

// Route for /:Commodity/histogram
app.get('/:Commodity/histogram', (req: Request, res: Response) => {
    // Logic to handle /:Commodity/histogram route
    const { Commodity } = req.params;
    const data = {
        title: `${Commodity} Histogram Route`,
        message: `This is the histogram route for ${Commodity}.`
    };
    const content = templateContent(data);
    res.render('index', { content });
});

// Route for /:CommodityType/histogram
app.get('/:CommodityType/histogram', (req: Request, res: Response) => {
    // Logic to handle /:CommodityType/histogram route
    const { CommodityType } = req.params;
    const data = {
        title: `${CommodityType} Histogram Route`,
        message: `This is the histogram route for ${CommodityType}.`
    };
    const content = templateContent(data);
    res.render('index', { content });
});

// Start the server
app.listen(appPort, () => {
    console.log(`Server is running on http://localhost:${appPort}`);
});
