
import { Layout, Menu } from 'tdesign-react';

const { Content, Footer, Aside } = Layout;
const { MenuItem } = Menu;

export function SmartSheetLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  console.log('pathname', pathname);

  return (
    <Layout onDragOver={(e) => e.preventDefault()}>
      <Aside style={{
        border: '1px solid rgba(0,0,0,.12)'
      }}>
        <Menu
          defaultValue={pathname}
          style={{ width: '100%', height: '100%', boxShadow: 'none' }}
          onChange={(event) => {
            navigate(event as string)
          }}
        >
          <MenuItem value="/konva/table">表格</MenuItem>
          <MenuItem value="3">甘特图</MenuItem>
          <MenuItem value="/konva/board">看板</MenuItem>
          <MenuItem value="5">日历</MenuItem>
          <MenuItem value="/konva/album">画册</MenuItem>
          <MenuItem value="/konva/conference">会议布局</MenuItem>
          
        </Menu>
      </Aside>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}