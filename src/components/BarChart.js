import * as React from 'react';
import Parse from 'parse/dist/parse.min.js';
import env from "react-dotenv";
import { BarChart } from '@mui/x-charts/BarChart';
import './BarChart.css';


Parse.initialize(env.PARSE_APPLICATION_ID, env.PARSE_JAVASCRIPT_KEY);
Parse.serverURL = env.PARSE_HOST_URL;

export default function Bar() {
    const [DT, setData] = React.useState([]);

    React.useEffect(() => {
        const fetchDataAndMigrate = async () => {
            try {
                const Polls = Parse.Object.extend('Polls');
                const query = new Parse.Query(Polls);
                const results = await query.find();

                if (results.length > 0) {
                    const poll = results[0];
                    let votes = poll.get('votes');
                    if (!Array.isArray(votes) && typeof votes === 'object') {
                        votes = Object.keys(votes).map(key => votes[key]);
                        poll.set('votes', votes);
                        await poll.save(); 
                    }

                    setData(votes);
                }
            } catch (error) {
                console.error('Error fetching and migrating data:', error);
            }
        };

        fetchDataAndMigrate();

        const client = new Parse.LiveQueryClient({
            applicationId: env.PARSE_APPLICATION_ID,
            serverURL: env.LIVE_SERVER_URL,
            javascriptKey: env.PARSE_JAVASCRIPT_KEY,
        });

        client.on('open', () => {
            console.log('LiveQuery Client connected');
        });

        client.on('error', (error) => {
            console.error('LiveQuery Client error:', error);
        });

        client.open();

        const Polls = Parse.Object.extend('Polls');
        const query = new Parse.Query(Polls);
        const subscription = client.subscribe(query);

        subscription.on('update', (poll) => {
            try {
                let votes = poll.get('votes');
                if (!Array.isArray(votes) && typeof votes === 'object') {
                    votes = Object.keys(votes).map(key => votes[key]);
                }

                setData(votes);
            } catch (error) {
                console.error('Error handling update event:', error);
            }
        });


        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const updateVote = async (id) => {
        try {
            const Polls = Parse.Object.extend('Polls');
            const query = new Parse.Query(Polls);
            const poll = await query.first();

            if (poll) {
                let votes = poll.get('votes');

                if (Array.isArray(votes)) {
                    votes[id] += 1;
                    poll.set('votes', votes);
                    await poll.save();
                } else {
                    console.error('Votes field is not an array.');
                }
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    const clearVotes = async () => {
        try {
            const Polls = Parse.Object.extend('Polls');
            const query = new Parse.Query(Polls);
            const poll = await query.first();

            if (poll) {
                const numOptions = 5;
                const resetVotes = Array(numOptions).fill(0);
                poll.set('votes', resetVotes);
                await poll.save();
                setData(resetVotes);
            }
        } catch (error) {
            console.error('Error clearing votes:', error);
        }
    };

    return (
        <>
            <h4>Most Popular EzEats Restaurants</h4>
            <div className='bar'>
                <BarChart
                    width={800}
                    height={350}
                    series={[
                        {
                            data: DT.length > 0 ? DT : [0, 0, 0, 0, 0],
                            id: 'uvId', label: 'Votes'
                        },
                    ]}
                    xAxis={[{
                        data: ["Pao", "Seecoz", "Telal", "Pizzaiolo", "Sudfa"],
                        scaleType: 'band'
                    }]}
                />
            </div>
            <h3><u>Cast Vote</u></h3>
            <div className='btn'>
                <button className='myButton' onClick={() => updateVote(0)}>
                    Pao
                </button>
                <button className='myButton' onClick={() => updateVote(1)}>
                    Seecoz
                </button>
                <button className='myButton' onClick={() => updateVote(2)}>
                    Telal
                </button>
                <button className='myButton' onClick={() => updateVote(3)}>
                    Pizzaiolo
                </button>
                <button className='myButton' onClick={() => updateVote(4)}>
                    Sudfa
                </button>
            </div>
            <div className='btn'>
                <button className='myButton' onClick={clearVotes}>
                    Clear Votes
                </button>
            </div>
        </>
    );
}
