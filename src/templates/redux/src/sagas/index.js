
import user from './user';
import personmanage from './personmanage';

export default function* rootSaga() {
    yield [
        user(),
        personmanage()
    ]
}

