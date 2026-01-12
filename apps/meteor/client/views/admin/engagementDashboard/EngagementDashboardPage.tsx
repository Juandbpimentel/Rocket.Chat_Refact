import { Box, Select, Tabs } from '@rocket.chat/fuselage';
import { PageScrollableContent, Page, PageHeader } from '@rocket.chat/ui-client';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChannelsTab from './channels/ChannelsTab';
import MessagesTab from './messages/MessagesTab';
import UsersTab from './users/UsersTab';

type Tab = 'users' | 'messages' | 'channels';

type Timezone = 'utc' | 'local';

type EngagementDashboardPageProps = {
	tab: Tab;
	onSelectTab?: (tab: Tab) => void;
};

const EngagementDashboardPage = ({ tab = 'users', onSelectTab }: EngagementDashboardPageProps): ReactElement => {
	const { t } = useTranslation();

	const timezoneOptions = useMemo<[Timezone, label: string][]>(
		() => [
			['utc', t('UTC_Timezone')],
			['local', t('Local_Timezone')],
		],
		[t],
	);

	const [timezoneId, setTimezoneId] = useState<Timezone>('utc');
	const handleTimezoneChange = (timezone: Timezone): void => setTimezoneId(timezone);

	// Simplify click handlers by returning an inline callback or undefined
	const handleTabClick = useCallback(
		(tab: Tab): undefined | (() => void) => (onSelectTab ? (): void => onSelectTab(tab) : undefined),
		[onSelectTab],
	);

	return (
		<Page background='tint'>
			<PageHeader title={t('Engagement')}>
				<Select
					options={timezoneOptions}
					value={timezoneId}
					onChange={(value) => handleTimezoneChange(String(value) as Timezone)}
					aria-label={t('Default_Timezone_For_Reporting')}
				/>
			</PageHeader>
			<Tabs>
				<Tabs.Item selected={tab === 'users'} onClick={handleTabClick('users')}>
					{t('Users')}
				</Tabs.Item>
				<Tabs.Item selected={tab === 'messages'} onClick={handleTabClick('messages')}>
					{t('Messages')}
				</Tabs.Item>
				<Tabs.Item selected={tab === 'channels'} onClick={handleTabClick('channels')}>
					{t('Channels')}
				</Tabs.Item>
			</Tabs>
			<PageScrollableContent padding={0}>
				<Box m={24}>
					{/* Use a discriminated union mapping to render the proper tab content */}
					{
						{
							users: <UsersTab timezone={timezoneId} />,
							messages: <MessagesTab timezone={timezoneId} />,
							channels: <ChannelsTab />,
						}[tab]
					}
				</Box>
			</PageScrollableContent>
		</Page>
	);
};

export default EngagementDashboardPage;
