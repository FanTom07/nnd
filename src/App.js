import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ConfigProvider, Snackbar, Avatar, ScreenSpinner, ActionSheet, ActionSheetItem, ModalCard, ModalRoot} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';

import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon20StoryOutline from '@vkontakte/icons/dist/20/story_outline';
import Icon20ArticleBoxOutline from '@vkontakte/icons/dist/20/article_box_outline';
import Icon20UsersOutline from '@vkontakte/icons/dist/20/users_outline';

const blueBackground = {
	backgroundColor: 'var(--accent)'
  };

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			message: true,
			scheme: 'space_gray',
			activePanel: 'home',
			activeModal: null,
			fetchedUser: null,
			snackbar: null,
			popout: null,
		};
		this.openInvites = this.openInvites.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	componentDidMount() {
		this.openInvites();
	  }

	closeModal() {
        this.setState({ activeModal: null });
    }

    modal = (e) => {
        this.setState({ activeModal: e.currentTarget.dataset.to })
	};
	
	setActiveModal(activeModal) {
		activeModal = activeModal || null;
		let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];

		if (activeModal === null) {
			modalHistory = [];
		} else if (modalHistory.indexOf(activeModal) !== -1) {
			modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
		} else {
			modalHistory.push(activeModal);
		}

		this.setState({
			activeModal,
			modalHistory
		});
	};

	componentDidMount() {

		window.addEventListener('popstate', () => this.goBack());

		this.setState({ popout: <ScreenSpinner /> })

		bridge.subscribe((e) => {
			switch (e.detail.type) {

				// Поддержка цветовой темы приложения
				case 'VKWebAppUpdateConfig':
					let schemeAttribute = document.createAttribute('scheme');
					schemeAttribute.value = e.detail.data.scheme ? e.detail.data.scheme : 'client_light';
					document.body.attributes.setNamedItem(schemeAttribute);
					this.setState({ theme: e.detail.data.scheme })

					bridge.send('VKWebAppSetViewSettings', {
						'status_bar_style': e.detail.data.scheme === 'space_gray' ? 'light' : 'dark',
						'action_bar_color': e.detail.data.scheme === 'space_gray' ? '#19191a' : '#ffff'
					});

				break;

				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });

					// Запускаем рекламу
					bridge.send('VKWebAppGetAds')
					.then((promoBannerProps) => {
						this.setState({ promoBannerProps });
					})

					this.setState({ popout: null })


				default:
			}
		});

		bridge.send('VKWebAppGetUserInfo', {});

		bridge.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					this.setState({ access_token: e.detail.data.access_token });
				break;

			default:
			}
		});

	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	// Переход на страницу
	go = (e) => {
		window.history.pushState( { panel: e.currentTarget.dataset.to }, e.currentTarget.dataset.to );
		this.setState({ 
			activePanel: e.currentTarget.dataset.to,
			history: [...this.state.history, e.currentTarget.dataset.to],
			snackbar: null
		})
	};

	addGroups() {
		bridge.send("VKWebAppAddToCommunity");
		bridge.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAddToCommunityResult':
					this.setState({ snackbar:
						<Snackbar
						layout="vertical"
						onClose={() => this.setState({ snackbar: null })}
				        before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
						>
						Приложениен успешно добавлено в сообщество.
						</Snackbar>
					});
				break;
				case 'VKWebAppAddToCommunityFailed':
					this.setState({ snackbar: null });
				break;

			default:
			}
		});
	}

	openInvites () {
		this.setState({ popout:
		  <ActionSheet onClose={() => this.setState({ popout: null })}>
			<ActionSheetItem autoclose before={<Icon20StoryOutline/>}
			  onClick={() => bridge.send("VKWebAppShowStoryBox", { "background_type" : "image", "url" : "https://sun9-10.userapi.com/impf/rMkBthcithc20cueRvyRi-pg8M2hAiMAOaYm8A/gvWX98KEYeU.jpg" })}
			>
			  Поделиться в истории
			</ActionSheetItem>
			<ActionSheetItem autoclose before={<Icon20ArticleBoxOutline/>} onClick={() => bridge.send("VKWebAppShowWallPostBox", {"message": "Привет! Я играю в игру под названием #НичегоНеДелать.\nПереходи по ссылке, и #НичегоНеДелай вместе со мной!"})}
			>
			  Поделиться в посте
			</ActionSheetItem>
			<ActionSheetItem autoclose before={<Icon20UsersOutline/>} onClick={() => this.addGroups()}
			>
			  Добавить в сообщество 
			</ActionSheetItem>
		  </ActionSheet>
		});	  
	  }


	render() {
     const modal = (
		<ModalRoot
        activeModal={this.state.activeModal}
        onClose={this.closeModal}
      >
        <ModalCard
          id='ava-btn'
          onClose={() => this.setState({activeModal: null})}
		  header="Зачем ты сюда нажал?"
		  caption="Закрой это окно!"
          actions={[
             {
            title: 'Закрыть',
            mode: 'primary',
            action: () => {
              this.setState({activeModal: null})
            }

          }]}
        >
			
        </ModalCard>

	  </ModalRoot>
	 );
		return (
			<ConfigProvider isWebView={true}>
				<View
				    modal={modal}
					activePanel={this.state.activePanel}
					popout={this.state.popout}
				>
					<Home id="home"
					    message={this.state.message}
					    modal={this.modal}
					    openInvites={this.openInvites}
						fetchedUser={this.state.fetchedUser}
						go={this.go}
						snackbar={this.state.snackbar}
						popout={this.state.popout}
					/>
				</View>
			</ConfigProvider>
		);

	}
}

export default App;