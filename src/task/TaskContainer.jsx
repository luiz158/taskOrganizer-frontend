import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment';
import dates from './dates';
import { Button } from '@material-ui/core';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddTaskForm from './AddTask';
import CustomDialog from '../reusable/Dialog/CustomDialog';
import { addTask, getTasksByUser } from '../actions/task';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {Add}  from "@material-ui/icons";

const styles = theme => ({
    button: {
        float: 'right'
    },
    marginAround: {
        margin: '1.2rem'
    }
});
class TaskContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddTaskDialog: false
        };

        this.closeTaskDialog = this.closeTaskDialog.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.submitTaskForm = this.submitTaskForm.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getTasksByUser(this.props.user._id));
    }

    showDialog() {
        console.log("addTask")
        this.setState({
            showAddTaskDialog: true
        });
    }
    closeTaskDialog() {
        this.setState({
            showAddTaskDialog: false
        });
    }
    submitTaskForm(values) {
        console.log(values)
        values["userId"] = this.props.user._id;
        
        if(values.allDay == false){
            let spSt = values.start.split("-");
            let startDate = new Date(spSt[0], parseInt(spSt[1])-1,spSt[2], values.selectStartHour, values.selectStartMinute);
            values.start = startDate;
    
            spSt = values.end.split("-");
            let endDate = new Date(spSt[0], parseInt(spSt[1])-1,spSt[2], values.selectEndHour, values.selectEndMinute);
            values.end = endDate;    
        }
        delete values["selectStartHour"];
        delete values["selectEndHour"];
        delete values["selectStartMinute"];
        delete values["selectEndMinute"];
        this.setState({
            showAddTaskDialog: false
        });
        this.props.dispatch(addTask(values));

    }
    render() {
        let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
        const localizer = BigCalendar.momentLocalizer(moment);
        const { classes } = this.props;
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", float:"right" }}>
                    <Button onClick={this.showDialog} className={classes.marginAround} alignt="right" variant="contained" color="primary" ><Add/> Add Task</Button>
                </div>
                <div style={{ display: "inline-block", height: 700, width: '100%' }}>
                {this.props.tasks && <BigCalendar
                    events={this.props.tasks}
                    views={allViews}
                    step={60}
                    showMultiDayTimes
                    max={dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours')}
                    defaultDate={new Date()}
                    localizer={localizer}
                />}
                </div>
                <CustomDialog
                    width="xs"
                    handleMount={this.state.showAddTaskDialog}
                    dialogTitle={"Add Task"}
                    dialogContent={<AddTaskForm onSubmit={this.submitTaskForm} />}
                    topCloseButton={true}
                    handleUnmount={this.closeTaskDialog}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user.user,
        showSuccessSnackbar: state.snackbar.showSuccessSnackbar,
        showErrorSnackbar: state.snackbar.showErrorSnackbar,
        message: state.snackbar.message,
        tasks: state.task.tasks
    };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(TaskContainer)));  