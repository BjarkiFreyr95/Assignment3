import React from 'react';
import { PropTypes } from 'prop-types';

class Username extends React.Component {

    componentDidMount() {
        const { socket } = this.context;
        socket.emit('users');
        socket.on('userlist', (list) => {
            console.log(list);
        });
    }

    constructor (props) {
        super(props);

        this.state = {
            username: ''
        };

    }
    validateUsername(un) {
        this.props.getUsername(un);
    }

    render () {
        const {username} = this.state;
        return (
            <div>
                <input
                    type="text" 
                    placeholder="Username" 
                    onInput={ (e) => this.setState({username: e.target.value})} required /> 
                <button type="button" onClick = {() => this.validateUsername(username)} > Ok </button>
            </div>
        );
    }
};

Username.contextTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired
    }),
    socket: PropTypes.object.isRequired
}

export default Username;