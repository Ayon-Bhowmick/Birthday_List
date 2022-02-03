import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

function App() {
	const [name, setName] = useState('');
	const [date, setDate] = useState('2020-01-01');
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState(false);
	const [error, setError] = useState(false);
	const [list, setList] =  useState([]);

	const handleInput = (e) => {
		const {name,value} = e.currentTarget;
		setName(value.trim());
  	}

	const handleDate = (date) => {
		let temp = date.toFormat('MM/dd/yyyy');
		setDate(temp.toString());
	}

	const addToList = async () => {
		setOpen(false);
		try {
			list.push({
				"name": name,
				"birthday": date
			});
			let obj = {};
			obj.name = name;
			obj.birthday = date;
			const res = await fetch('/api/people', {
				body: JSON.stringify(obj),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			});
			setAlert(true);
		} catch (error) {
			console.log(error);
			setError(true);
		}
	}

	const remove = async (name) => {
		const id = await fetch('/api/remove', {
			body: JSON.stringify({name}),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
		});
		setList(list.filter(item => item.name !== name));
	}

	const handleSubmit = () => {
		if (name === '' || date === '2020-01-01') {
			setError(true);
			return;
		}
		setOpen(true);
	}

	useEffect(() => {
		async function fillList() {
			const res = await fetch('/api/list');
			const result = await res.json();
			setList(result);
		}
		fillList();
	}, []);

	return(
		<div className="App">
			<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title" >
				<DialogTitle id="form-dialog-title">{name} was born on {date}</DialogTitle>
				<DialogActions>
					<Button onClick={() => setOpen(false)} color="primary">disagree</Button>
					<Button onClick={addToList} color="primary" autoFocus>agree</Button>
				</DialogActions>
			</Dialog>
			<Box sx={{mx:50, marginTop:5, marginBottom:1}}>
				<Typography variant="h3" component="h1" sx={{marginBottom:2, mx:11}}>Enter Name and Birthday</Typography>
				<Grid container spacing={3}>
					<Grid item xs={8}>
						<TextField sx={{width:1}} label="name" name="name" variant="standard" value={name} onChange={handleInput} />
					</Grid>
					<Grid item xs={4}>	
						<LocalizationProvider dateAdapter={DateAdapter}>
							<DatePicker disableFuture sx={{marginTop:5}} openTo="year" 
										views={['year', 'month', 'day']} label="birthday" value={date} 
										onChange={(newValue) => {handleDate(newValue)}} renderInput={(params) => <TextField {...params} />}/>
						</LocalizationProvider>
					</Grid>
				</Grid>
			</Box>
			<Button variant="contained" sx={{marginTop: 1, mx:50, width:0.475, marginBottom:6}} onClick={handleSubmit}>
				save
			</Button>
			<Box sx={{marginBottom:4}}>
				{list.map((x, index) => {
					return(
						<Box key={x.name} sx={{mx:50, marginBottom:1}}>
							<AppBar position="static" color="default">
								<Toolbar>
									<IconButton onClick={() => remove(x.name)} sx={{ mr: 2 }}>
										<RemoveCircleRoundedIcon fontSize="large" />
									</IconButton>
									<Typography variant="h6" component="h1">{x.name} was born on {x.birthday}</Typography>
								</Toolbar>
							</AppBar>
						</Box>
					);
				})}
			</Box>
			<Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
				<MuiAlert elevation={6} variant="filled" onClose={() => setAlert(false)} severity="success">
					{name} was added to the list
				</MuiAlert>
			</Snackbar>
			<Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
				{(name === '' || date === '2020-01-01') ?
				<MuiAlert elevation={6} variant="filled" onClose={() => setError(false)} severity="error">
					Please enter a {(name === '') ? (date === '2020-01-01') ? 'name and birthday' :'name' : 'birthday'}
				</MuiAlert>
				:
				<MuiAlert elevation={6} variant="filled" onClose={() => setError(false)} severity="error">
					There was an error adding {name} to the list
				</MuiAlert>}
			</Snackbar>
		</div>
	);
}

export default App;
