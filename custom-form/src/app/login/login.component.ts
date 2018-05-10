/*!
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import * as OktaAuth from '@okta/okta-auth-js';

import config from '../.samples.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  oktaAuth = new OktaAuth({
    url: config.oidc.issuer.split("/oauth2/")[0],
    clientId: config.oidc.clientId,
    issuer: config.oidc.issuer,
    redirectUri: config.oidc.redirectUri,
  });

  constructor() {}

  ngOnInit() {}

  async login() {
    var transaction = await this.oktaAuth.signIn({ username : this.username, password : this.password });
    if (transaction.status === 'SUCCESS') {
      var sessionToken = transaction.sessionToken;
      if (sessionToken) {
        // Okta's auth-js does the heavy lifting here. Not only will getWithRedirect make the oauth authorize request,
        // it will perform token validation upon return of token(s), and throw exception if token is invalid
        // Here, we request idToken and accessTokens, which are redirected to the redirectUri (which should be routed to OktaCallbackComponent from @okta/okta-angular)
        this.oktaAuth.token.getWithRedirect({
            responseType: ['id_token', 'token'],
            sessionToken: sessionToken,
            scopes: config.oidc.scope.split(" ")
        });
      }
    } else {
      throw 'Cannot handle the ' + transaction.status + ' status';
    }
  }

}

