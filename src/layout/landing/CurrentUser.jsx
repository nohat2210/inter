import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'shared/components/common';
import authApi from 'api/auth';
import {
  getToken,
  removeToken,
  removeAccessToken,
  removeRefreshToken,
  getRefreshToken,
} from 'core/token';
import {
  removeCurrentUser,
  getCurrentUser,
  getAvatar,
  removeAvatar,
} from 'core/currentUser';
import SVGIcon from 'shared/components/SVGIcon';
import { JSONParse } from 'shared/utils/tool';
import { removeSaveProduct } from 'core/saveProduct';
import { useToast } from 'shared/hooks/useToast';

const CurrentUser = () => {
  const token = getToken();
  const { toast } = useToast();
  const profile = JSONParse(getCurrentUser());
  const refreshToken = getRefreshToken();
  const defaultAvatar = getAvatar();
  const onLogout = async () => {
    if (token) {
      try {
        removeAccessToken();
        removeRefreshToken();
        await authApi.logout(refreshToken);
        removeToken();
        removeCurrentUser();
        removeSaveProduct();
        removeAvatar();
      } catch (error) {
        toast.error(error);
      }
    }
  };
  if (token) {
    return (
      <>
        <span className="nav__notification relative">
          <SVGIcon width={25} height={25} icon="bell-icon" />
        </span>
        <div className="nav__user mr-5 relative">
          <Avatar src={profile?.avatar || defaultAvatar} />
          <div className="nav__user-menu">
            <Link className="nav__user-menu-item" to="/my-profile">
              My profile
            </Link>
            <Link className="nav__user-menu-item" to="/products/post">
              Post product
            </Link>
            <Link
              title="log out"
              className="nav__user-menu-item"
              onClick={onLogout}
            >
              Log out
              <SVGIcon icon="logout-icon" />
            </Link>
          </div>
        </div>
      </>
    );
  }
  return (
    <Link title="login" role="button" className="nav__btn flex" to="/login">
      <span className="mr-2">
        <SVGIcon icon="login-icon" />
      </span>
      log in
    </Link>
  );
};

export default CurrentUser;
