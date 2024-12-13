import type React from 'react';
import { Link } from 'react-router-dom';
import type {IUser} from '../@types/User';


const UserCard: React.FC<IUser> = ({ _id, username, email, status, role }) => { 
  return (
    <div className="user-card">
      <Link to={`/user/${_id}`}> + </Link>
      <h3>{username}</h3>
      <p>{email}</p>
      <p>{status?.status_name || 'N/A'}</p>
      <p>{role?.role_name || 'N/A'}</p>
    </div>
  );
};

export default UserCard;
