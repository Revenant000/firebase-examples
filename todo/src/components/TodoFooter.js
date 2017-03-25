import React, { PropTypes } from 'react';
import classnames from 'classnames';

import {
    ALL_TODOS,
    ACTIVE_TODOS,
    COMPLETED_TODOS
} from '../constants'
import { pluralize } from '../utils'

export default function TodoFooter ({
    count,
    nowShowing,
    completedCount,
    onClearCompleted,
    changeNav
}) {
    const activeTodoWord = (count, 'item');

    const onChangeNav = (location) => {
        changeNav(location)
    }

    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{count}</strong> {activeTodoWord} left
            </span>
            <ul className="filters">
                <li>
                    <a
                        onClick={onChangeNav.bind(this, '/')}
                        className={classnames({selected: nowShowing === ALL_TODOS})}>
                            All
                    </a>
                </li>
                {' '}
                <li>
                    <a
                        onClick={onChangeNav.bind(this, '/active')}
                        className={classnames({selected: nowShowing === ACTIVE_TODOS})}>
                            Active
                    </a>
                </li>
                {' '}
                <li>
                    <a
                        onClick={onChangeNav.bind(this, '/completed')}
                        className={classnames({selected: nowShowing === COMPLETED_TODOS})}>
                            Completed
                    </a>
                </li>
            </ul>
        </footer>
    )
}

TodoFooter.propTypes = {
    count: PropTypes.number.isRequired,
    nowShowing: PropTypes.string.isRequired,
    completedCount: PropTypes.number.isRequired,
    onClearCompleted: PropTypes.func.isRequired
}