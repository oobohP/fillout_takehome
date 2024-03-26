require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (_, res) => {
    res.send('This is the Fillout takehome task refer the notion link and this api doc:https://www.fillout.com/help/fillout-rest-api');
});

app.get('/:formId/filteredResponses', async (req, res) => {
    const { formId } = req.params;
    const { limit, afterDate, beforeDate, offset, status, includeEditLink, sort, filters } = req.query;
    const apiUrl = `https://api.fillout.com/v1/api/forms/${formId}/submissions`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`
            },
            params: { limit, afterDate, beforeDate, offset, status, includeEditLink, sort }
        });

        let filterParams = [];
        if (filters && filters !== '[]') {
            try {
                filterParams = JSON.parse(filters);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid filters format' });
            }
        } else {
            // return regular response from Fillout API if no filters are applied
            return res.json(response.data)
        }

        console.log(filterParams)
        // Filter if there are any applied
        const responseData = response.data.responses.filter(r => {
            return filterParams.every(filter => {
                return r.questions.some(question => {
                    const value = question.value;
                    switch (filter.condition) {
                        case 'equals': return question.id === filter.id && value === filter.value;
                        case 'does_not_equal': return question.id === filter.id && value !== filter.value;
                        case 'greater_than': return question.id === filter.id && new Date(value) > new Date(filter.value);
                        case 'less_than': return question.id === filter.id && new Date(value) < new Date(filter.value);
                        default: return false;
                    }
                });
            });
        });

        res.json({
            responses: responseData,
            totalResponses: responseData.length,
            pageCount: Math.ceil(responseData.length / (limit || 150))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal error occurred' });
    }
});
