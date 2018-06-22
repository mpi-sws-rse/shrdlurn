/* Dictionary: implements a list of induced definitions for the user to review them
 * DictionaryItem: a single element of the Dictionary list
 */

import React, { Component, PropTypes } from "react"
import classnames from "classnames"
import Actions from "actions/world"
import { connect } from "react-redux"


import "./styles.css"

class DictionaryPanel extends Component {
	static propTypes = {
	    dispatch: PropTypes.func,
	    dictionary: PropTypes.array
	 }
	
	constructor(props) {
		super(props)
		this.state = ({
			collapsed: true,
		})
	}

	//force update when an induced rule is added
	shouldComponentUpdate(nextProps, nextState){
		if (this.props.dictionary.length !== nextProps.dictionary.length ||
			this.state.collapsed !== nextState.collapsed) {
			return true
		}
		else{
			return false
		}
	}
		
	render() {
		return (
			<div className={classnames("Dictionary", {"collapsed": this.state.collapsed})}>
				<div className="Dictionary-header">
		          <span className="Dictionary-header-name">Dictionary</span>
		          <div onClick={() => 
		          	this.setState({ collapsed: !this.state.collapsed })}
		          className="Dictionary-header-arrow">
		            {(() => {
		              if (this.state.collapsed) {
		            	  return (<span>&larr;</span>)
		              }
		              else {
		          		  this.props.dispatch(Actions.dictionary())
		            	  return (<span>&rarr;</span>)
		              }
		            })()}
		          </div>
		        </div>
		        {!this.state.collapsed && <Dictionary dictionary={this.props.dictionary}/>}
			</div>
		)
	}
}

class Dictionary extends Component{
	static PropTypes= {
		dictionary: PropTypes.array
	}
	
	constructor(props) {
		super(props)
		const length = this.props.dictionary.length;
		this.state={
			clicked: Array(length+1).fill(false), 
			//+1 to length to make up for off by one when using rule.index to index the array 
			prevClick: -1
		}
	}
	
	shouldComponentUpdate(nextProps, nextState){
		//dictionary changed
		if (this.props.dictionary.length !== nextProps.dictionary.length) {
			return true
		}
		//cell has been clicked
		else if (this.state.prevClick !== nextState.prevClick) {
			return true
		}
		//cell has been clicked
		else if (this.state.prevClick !== nextState.prevClick) {
			return true
		}
		else{
			return false
		}
	}

	/** 
	 * Function to allow the clicking of a rule to expand the head and body used to induce it
	*/
	handleClick(i){
		const clicked = this.state.clicked.slice()
		let prevClick = this.state.prevClick
		//there is an element that is already expanded
		if (prevClick >0) {
			if (prevClick === i) {
				clicked[prevClick] = false
				prevClick = -1
			} 
			else {
				clicked[prevClick] = false
				clicked[i] = true
				prevClick = i
			}
		}
		//no element is expanded
		else {
			clicked[i] = true
			prevClick = i
		}
		this.setState({
			clicked: clicked,
			prevClick: prevClick
		})
	}
	
	//scroll to top after update
	componentDidUpdate(prevProps){
		if (this.props.dictionary.length !== prevProps.dictionary.length){
			this.refs.list.scrollTop = 0	
			const clicked = this.state.clicked
			clicked[this.state.prevClick] = false
			this.setState({
				clicked: clicked,
				prevClick: -1
			})
		}
	}
	
	//get array of HTML elements to represent the rules
	getDictionaryCells(){
		const dictionary = this.props.dictionary.slice();
		const arr = dictionary.map((el) => {
			return (
				<DictionaryElement 
				key={el.index} 
				rule={el} 
				clicked={this.state.clicked[el.index]} 
				onClick={() => this.handleClick(el.index)}/>
			)
		}) 
		return arr
	} 

	render(){

		return (
				<div className="Dictionary-content" ref="list">
		        	<table>
		        		<tbody>
			        	<tr className="Explanation">
			        		<td colSpan="2">Click on a rule to see an example</td>
			        	</tr>
		        			{this.getDictionaryCells()}
		        		</tbody>
		        	</table>
				</div>
		)
	}
}

/** 
 * Functional react component to represent a rule
*/
function DictionaryElement(props){	
	const rule = props.rule
	return (
		<tr className="DictionaryElement"
			onClick={props.onClick}>
		{(() => 
		{if (props.clicked) {
			return ([
				<td className="head" colSpan="1" key="head">{rule.head}</td>,
				<td className="body" colSpan="1" key="body">{rule.body}</td>
			])}
			else {
			return (
				<td colSpan="2">{rule.rhs}</td>
			)}
		})()}
		</tr>)
}

const mapStateToProps = (state) => ({
  dictionary: state.world.dictionary
})

export default connect(mapStateToProps)(DictionaryPanel)