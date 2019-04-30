import React from 'react';
import './AlertDialog.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class AlertDialog extends React.Component {
  state = {
    open: this.props.open
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  generateAlertTitleClassFromProps = () => {
      return this.props.isBreak ? "alert-dialog-title-break" : "alert-dialog-title";
  } 

  render() {
    return (
      <div id="alert-wrapper">
        <Dialog
          open={this.props.open}
          onClose={this.props.handleAlertClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{root: 'alert-dialog-box'}}
        >
          <DialogTitle disableTypography={true} classes={{root: this.generateAlertTitleClassFromProps()}}>
            {this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleAlertClose} color="primary" autoFocus>
              close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;