/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useState } from 'react';

import { AesirXDam } from 'aesirx-dam-app';

import 'aesirx-dam-app/dist/index.css';
import 'aesirx-dam-app/dist/index.css.map';

function AesirXDam() {
  const [show, setShow] = useState(true);
  const onDoubleClick = (data) => {
    // do something when user onDoubleClick at on that assets
  };
  const onShow = () => {
    // on Show
  };
  const onHide = () => {
    // on Hide
  };
  return (
    <div className="py-4 px-3 h-100 flex-direction-column">
      <div className="h-100 flex-1">
        <AesirXDam show={show} onShow={onShow} onHide={onHide} onDoubleClick={onDoubleClick} />
      </div>
    </div>
  );
}

export default AesirXDam;
