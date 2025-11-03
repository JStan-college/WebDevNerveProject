import React from 'react';
import "./leftBar.scss";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';

const LeftBar = () => {
  return (
    <div className="leftbar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src="https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" />
            <span>Jane Doe</span>
          </div>
          <div className="item">
            <PeopleAltOutlinedIcon />
            <span>Friends</span>
          </div>
          <div className="item">
            <GroupsOutlinedIcon />
            <span>Groups</span>
          </div>
          <div className="item">
            <AssignmentOutlinedIcon />
            <span>Challenges</span>
          </div>
          <div className="item">
            <AddBoxOutlinedIcon />
            <span>Create</span>
          </div>
          <div className="item">
            <NotificationsOutlinedIcon />
            <span>Notifications</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default LeftBar;