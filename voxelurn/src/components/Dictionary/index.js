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
		this.state={
			dictionary: props.dictionary,
		}
	}
	
	shouldComponentUpdate(nextProps){
		if (this.props.dictionary.length !== nextProps.dictionary.length) {
			return true
		}
		else{
			return false
		}
	}
	
	//scroll to top after update
	componentDidUpdate(){
		this.refs.list.scrollTop = 0
	}
	
	getDictionaryCells(){
		const dictionary = this.props.dictionary.slice();
		const arr = dictionary.map((el) => {
			return (
				<DictionaryElement key={el.index} rule={el} />
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
			        		<td colSpan="2">Hover over a rule to see an example</td>
			        	</tr>
		        			{this.getDictionaryCells()}
		        		</tbody>
		        	</table>
				</div>
		)
	}
}

class DictionaryElement extends Component{	
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.state={
			rhs: this.props.rule.rhs,
			uid: this.props.rule.uid,
			head: this.props.rule.head,
			body:this.props.rule.body,
			index: this.props.rule.index,
			isHovering: false,
		}
	}
	
	handleClick() {
		this.setState(({
			rhs: this.state.rhs,
			uid: this.state.uid,
			head: this.state.head,
			body: this.state.body,
			index: this.state.index,
			isHovering: !this.state.isHovering,
		}))
	}

	
	render () {
		return (
			<tr 
				className="DictionaryElement"
				onClick={this.handleClick}
			>
			{(() => {if (this.state.isHovering) {
			return(
				[<td className="head" colSpan="1" key="head">{this.state.head}</td>,
				<td className="body" colSpan="1" key="body">{this.state.body}</td>]
			)}
			else {
			return (
				<td colSpan="2">{this.state.rhs}</td>
			)}})()}
			</tr>)
	}
}
const mapStateToProps = (state) => ({
  dictionary: state.world.dictionary
})

export default connect(mapStateToProps)(DictionaryPanel)