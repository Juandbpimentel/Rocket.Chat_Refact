import type { IRoom } from '@rocket.chat/core-typings';
import { isOmnichannelRoom } from '@rocket.chat/core-typings';
import { Icon } from '@rocket.chat/fuselage';
import type { ComponentProps, ReactElement } from 'react';
import { isValidElement } from 'react';

import { OmnichannelRoomIcon } from './OmnichannelRoomIcon';
import { useRoomIcon } from '../../hooks/useRoomIcon';

export const RoomIcon = ({
	room,
	size = 'x16',
	isIncomingCall,
	placement = 'default',
}: {
	room: Pick<IRoom, 't' | 'prid' | 'teamMain' | 'uids' | 'u'>;
	size?: ComponentProps<typeof Icon>['size'];
	isIncomingCall?: boolean;
	placement?: 'sidebar' | 'default';
}): ReactElement | null => {
	const iconPropsOrReactNode = useRoomIcon(room);

	if (isIncomingCall) {
		return <Icon name='phone' size={size} />;
	}

	if (isOmnichannelRoom(room)) {
		return <OmnichannelRoomIcon placement={placement} source={room.source} status={room.v?.status} size={size} />;
	}

	if (isValidElement(iconPropsOrReactNode)) {
		return iconPropsOrReactNode;
	}

	if (!iconPropsOrReactNode) {
		return null;
	}

	// iconPropsOrReactNode can be either props for <Icon> or a React element. At this point
	// we've already handled the React element case above, so this must be props for <Icon>.
	return <Icon {...(iconPropsOrReactNode as ComponentProps<typeof Icon>)} size={size} />;
};
