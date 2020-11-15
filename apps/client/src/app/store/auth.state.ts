import { Selector, State, StateContext } from '@ngxs/store';
import { EmitterAction, Receiver } from '@ngxs-labs/emitter';

export interface UserModel {
  id: string;
  login: string;
  display_name: string;
  profilePic: string;
}

export interface AuthStateModel {
  token: string;
  user: UserModel
}

/**
 * State of authentication (is user authenticated?)
 */
@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: undefined,
    user: undefined
  }
})
export class AuthState {
  /** sets the authenticated state - usually after a successful login */
  @Receiver()
  public static setAuthenticated({ setState }: StateContext<AuthStateModel>, { payload }: EmitterAction<AuthStateModel>) {
    setState({
      token: payload.token,
      user: payload.user
    });
  }


  @Selector()
  public static getUser(state: AuthStateModel): UserModel {
    return state.user;
  }
}
