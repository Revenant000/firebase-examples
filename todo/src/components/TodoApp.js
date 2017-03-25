import React, { Component } from 'react'
import createHistory from 'history/createBrowserHistory'

import {
    ALL_TODOS,
    ACTIVE_TODOS,
    COMPLETED_TODOS,
    ENTER_KEY
} from '../constants'
import { connect } from '../hoc/FirebaseHOC'

import TodoItem from './TodoItem'
import TodoFooter from './TodoFooter'

import baseStyles from '../../node_modules/todomvc-common/base.css'
import indexStyles from '../../node_modules/todomvc-app-css/index.css'

class TodoApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nowShowing: ALL_TODOS,
            editing: null,
            newTodo: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
    }

    componentDidMount() {
        var locationMap = {
            '/': ALL_TODOS,
            '/active': ACTIVE_TODOS,
            '/completed': COMPLETED_TODOS
        }

        this.history = createHistory()
        this.unlisten = this.history.listen((location, action) => {
            this.setState({
                nowShowing: locationMap[location.pathname]
            })
        })

        this.history.push('/');
    }

    componentWillUnmount() {
        this.unlisten();
    }

    changeNav(location) {
        this.history.push(location);
    }

    handleChange(event) {
        this.setState({ newTodo: event.target.value });
    }

    handleNewTodoKeyDown(event) {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        const val = this.state.newTodo.trim();

        if (val) {
            this.props.addTodo({
                title: val,
                completed: false
            })
            this.setState({ newTodo: '' });
        }
    }

    toggleAll(event) {
        const checked = event.target.checked;
        this.props.model.toggleAll(checked);
    }

    toggle(todo) {
        this.props.updateTodo(todo.key, 'completed', !todo.completed);
    }

    destroy(todo) {
        this.props.removeTodo(todo.key)
    }

    edit(todo) {
        this.setState({ editing: todo.key });
    }

    save(todo, text) {
        this.props.updateTodo(todo.key, 'title', text);
        this.setState({ editing: null });
    }

    cancel() {
        this.setState({ editing: null });
    }

    getParts(todos) {
        let main = null;
        let footer = null;

        const todosArray = Object.keys(todos).map((key) => {
            return Object.assign(todos[key], { key: key });
        })

        const shownTodos = todosArray.filter((todo) => {
            switch (this.state.nowShowing) {
            case ACTIVE_TODOS:
                return !todo.completed;
            case COMPLETED_TODOS:
                return todo.completed;
            default:
                return true;
            }
        })

        const todoItems = shownTodos.map((todo) => {
            return (
                <TodoItem
                    key={todo.key}
                    todo={todo}
                    onToggle={this.toggle.bind(this, todo)}
                    onDestroy={this.destroy.bind(this, todo)}
                    onEdit={this.edit.bind(this, todo)}
                    editing={this.state.editing === todo.key}
                    onSave={this.save.bind(this, todo)}
                    onCancel={this.cancel}
                />
            )
        })

        const activeTodoCount = todosArray.reduce((accum, todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todosArray.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer =
                <TodoFooter
                    count={activeTodoCount}
                    completedCount={completedCount}
                    nowShowing={this.state.nowShowing}
                    changeNav={this.changeNav.bind(this)}
                />;
        }

        if (todosArray.length) {
            main = (
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        onChange={this.toggleAll}
                        checked={activeTodoCount === 0}
                    />
                    <ul className="todo-list" style={{ display: todoItems.length ? 'block' : 'none' }}>
                        {todoItems}
                    </ul>
                    <span style={{ display: todoItems.length ? 'none' : 'block', padding: '20px', textAlign: 'center', color: '#ccc' }}>Nothing to show</span>
                </section>
            );
        }

        return {
            main,
            footer
        }
    }

    render() {
        const { todos } = this.props;
        const { main, footer } = this.getParts(todos);

        return (
            <div>
                <header className="header">
                    <h1>todos</h1>
                    <input
                        className="new-todo"
                        placeholder="What needs to be done?"
                        value={this.state.newTodo}
                        onKeyDown={this.handleNewTodoKeyDown}
                        onChange={this.handleChange}
                        autoFocus={true}
                    />
                </header>
                {main}
                {footer}
            </div>
        )
    }
}

TodoApp.defaultProps = {
    todos: {}
}

export default connect(TodoApp);