import React, { useState } from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Button, Group, Avatar, Div, PanelHeaderContent, Banner, Title } from '@vkontakte/vkui';
import '../css/style.css';

import Icon56FaceIdOutline from '@vkontakte/icons/dist/56/face_id_outline';

const Home = props => (
	<Panel id={props.id}>
		{props.fetchedUser &&
    <PanelHeader>
	<PanelHeaderContent
	  status={`${props.fetchedUser.first_name} ${props.fetchedUser.last_name}`}
	  before={<Avatar size={36} src={props.fetchedUser.photo_200} onClick={props.modal} data-to='ava-btn' />}
	>
	  #НичегоНеДелать
	</PanelHeaderContent>
  </PanelHeader>}
		<Group>
			<Div>
			<Button before={<Icon56FaceIdOutline width={20} height={20} />} size="xl" className="invite-btn" onClick={() => props.openInvites()} >
		  Поделиться
		  </Button>
			</Div>
		</Group>

		<Banner
				className = 'bannerSecond'
				mode="image"
				size='m'
				header={<Title level = '3'>Нажми сюда</Title>}
				id = 'notify'
				subheader='Интересно, что прозойдет?'
				background={
				<div
					style={{
					background: '#4986CC',
					backgroundPosition: 'right bottom',
					backgroundSize: 760,
					transition: '420ms',
					backgroundRepeat: 'no-repeat',
					webkitBoxShadow: 'inset 0px 0px 10px 8px rgba(0,0,0,0.085)',
					mozBoxShadow:'inset 0px 0px 10px 8px rgba(0,0,0,0.085)',
					boxShadow:'inset 0px 0px 10px 8px rgba(0,0,0,0.085)'
					}}
				/>
				}
			/>

	</Panel>
);

Home.propTypes = {
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

export default Home;
