import React from "react";
import './App.css';
import convert from 'xml-js';
class App extends React.Component {

	// Constructor
	constructor(props) {
		super(props);
		this.state = {
			jsonData:[],
			xmlData:[],
			personData:[],
			DataisLoaded: false
		};
	}
	// This function uses fetch for API 1 to get the person details from a persons json file
	fetchJson(){
		fetch('./persons.json')
		.then((res) => res.json())
		.then((json) => {
			console.log(json.person)
		this.setState({
			jsonData: json.person,
			DataisLoaded: true
		});
		})
	}
	// This function uses fetch for API 2 to get the person details from a persons xml file
	fetchXML(){
		fetch('./persons.xml')
		.then((res) => res.text())
		.then((text) => {
			var options = {compact: true, ignoreComment: true, spaces: 4};
			// xml2json is being used to convert the xml text to json 
			var result = JSON.parse(convert.xml2json(text, options));
			// tranforming the json to match the api 1 response 
			let res = result.persons.person.map((val) => {
				return { // Return the new object structure
					id: parseInt(val.id._text),
					firstName: val.firstName._text,
					lastName:val.lastName._text
				}
				});
			this.setState({
				xmlData: res,
				DataisLoaded: true
			});
			setTimeout(() => {
				this.transformJson(this.state.jsonData, this.state.xmlData)
			}, 100);
		})
	}
	// this function combines API 1 and API 2 and creates a sorted array based on id
	transformJson(jsonData, xmlData){
		let combinedItems = Object
							.values([...jsonData, ...xmlData]
							.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}))
							.sort((a, b) => (a.id - b.id))
		this.setState({
			personData: combinedItems,
			DataisLoaded: true
		})
	}
	// Lifecycle method 
	componentDidMount() {
		this.fetchJson();
		this.fetchXML();
	}
	render() {
		const { DataisLoaded, personData } = this.state;
		if (!DataisLoaded) return <div>
			<h1> Pleses wait some time.... </h1> </div> ;

		return (
		<div className = "App">
			<h1> Fetch data from an api in react </h1> {
				personData.map((item) => (
				<ol key = { item.id } >
					Id: {item.id}
					FirstName: { item.firstName },
					LastName: { item.lastName },
					</ol>
				))
			}
		</div>
	);
}
}

export default App;
