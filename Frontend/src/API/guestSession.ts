import {NewInstance} from '../API/base.api';
const guestEP = 'authentication/guest_session/new';

export const guestSession = async () => {
	const response = await NewInstance.get(guestEP);
    return response;
};

