import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import {
    ESCAPE_KEY,
    ENTER_KEY,
} from '../constants'

export default class TodoItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editText: ''
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount(){
        this.setState({
            editText: this.props.todo.title
        })
    }

    componentDidUpdate(prevProps) {
        const node = this.editField;

        if (!prevProps.editing && this.props.editing) {
            node.focus()
            node.setSelectionRange(node.value.length, node.value.length)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.todo !== this.props.todo ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText
        );
    }

    handleSubmit(event) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({ editText: val });
        } else {
            this.props.onDestroy();
        }
    }

    handleEdit() {
        this.props.onEdit();
        this.setState({ editText: this.props.todo.title });
    }

    handleKeyDown(event) {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: this.props.todo.title});
            this.props.onCancel(event);
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit(event);
        }
    }

    handleChange(event) {
        if (this.props.editing) {
            this.setState({editText: event.target.value});
        }
    }

    render() {
        const {
            todo,
            editing,
            completed,
            onToggle,
            onDestroy,
        } = this.props

        return (
            <li className={classnames({
                completed: todo.completed,
                editing: editing
            })}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={onToggle}
                    />
                    <label onDoubleClick={this.handleEdit}>
                        {todo.title}
                    </label>
                    <button className="destroy" onClick={onDestroy} />
                </div>
                <input
                    ref={(input) => { this.editField = input; }}
                    className="edit"
                    value={this.state.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            </li>
        )
    }
}

TodoItem.propTypes = {
    todo: PropTypes.shape({
        title: PropTypes.string,
        completed: PropTypes.bool
    }).isRequired,
    editing: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onDestroy: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}