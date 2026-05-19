import Overview from '../../../../bpl-tools/Admin/Overview';
import Changelog from '../../../../bpl-tools/Admin/Changelog';

const Welcome = (props) => {
    return <Overview {...props}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px'
        }}>
            <Changelog {...props} />
        </div>
    </Overview>
}
export default Welcome;
