import React, {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import './MenuDrawer.css';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HamburgerMenu from 'react-hamburger-menu';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../shared/Auth';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

const MenuDrawer = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useContext(AuthContext);

  const toggleDrawer = (boolean) => () => {
    setIsOpen(boolean);
  };

  
  const { classes } = props;

  const loggedInList = (
    <div className={classes.list}>
      <List>
        {['multitimer', 'pomodoro'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <Icon className='far fa-clock' /> : <Icon  className='stopwatch fas fa-stopwatch' />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['login', 'register'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon >{index % 2 === 0 ? <Icon className='far fa-user' /> : <Icon className='fas fa-user-plus' />}</ListItemIcon>
            <Link to={"/register"}><ListItemText primary={text} /></Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const loggedOutList = (
    <div className={classes.list}>
      <List>
        {['multitimer', 'pomodoro'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <Icon className='far fa-clock' /> : <Icon  className='stopwatch fas fa-stopwatch' />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['login', 'register'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon >{index % 2 === 0 ? <Icon className='far fa-user' /> : <Icon className='fas fa-user-plus' />}</ListItemIcon>
            <Link to={"/register"}><ListItemText primary={text} /></Link>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderDrawerList = () => {
    return user ? loggedInList : loggedOutList; 
  }

  return (
    <div id="mobile-hamburger">
      <HamburgerMenu
          isOpen={isOpen}
          menuClicked={toggleDrawer(true)}
          width={18}
          height={15}
          strokeWidth={2}
          rotate={0}
          color='grey'
          borderRadius={0}
          animationDuration={0.5}
      />
      <Drawer open={isOpen} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {renderDrawerList()}
        </div>
      </Drawer>
    </div>
  );

}

MenuDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuDrawer);