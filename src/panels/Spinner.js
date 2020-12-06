import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader } from '@vkontakte/vkui';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';

import '../css/style.css'

const Spinner = props => (
	<Panel id={props.id}>
    <div class='snowContainer'>
	  <div class='snow'>
    <PanelHeader before={<Icon16Cancel/>} onClick={props.go} data-to='home'>Ля какие крутилки</PanelHeader>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Spinner size="large" style={{ marginTop: 20 }} />
      <Spinner size="medium" style={{ marginTop: 20 }} />
      <Spinner size="regular" style={{ marginTop: 20 }} />
      <Spinner size="small" style={{ marginTop: 20 }} />
    </div>
    </div>
    </div>
	</Panel>
);

Spinner.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
		title: PropTypes.string, 
		}),
	}),
};

export default Spinner;
