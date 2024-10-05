import './index.less'

import { button } from '@assets/motion'
import { useUserStore } from '@store/user'
import { motion, useScroll, useSpring } from 'framer-motion'
import Button from 'tdesign-react/esm/button'

class User {
  name!: string
  constructor() {
    this.name = 'laoer536'
  }
}

function AppAbout() {
  const [page, setPage] = useState(1)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <h1>
        <code>useScroll</code> with spring smoothing
      </h1>

      <>
        <article>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac rhoncus quam.</p>
          <p>
            Fringilla quam urna. Cras turpis elit, euismod eget ligula quis, imperdiet sagittis justo. In viverra
            fermentum ex ac vestibulum. Aliquam eleifend nunc a luctus porta. Mauris laoreet augue ut felis blandit, at
            iaculis odio ultrices. Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt neque tincidunt a.
          </p>
          <h2>Sub-header</h2>
          <p>
            In eget sodales arcu, consectetur efficitur metus. Duis efficitur tincidunt odio, sit amet laoreet massa
            fringilla eu.
          </p>
          <p>
            Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo
            venenatis. Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
          </p>
          <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
          <p>
            Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra leo vitae tristique rutrum. Donec ut
            volutpat ante, ut suscipit leo.
          </p>
          <h2>Sub-header</h2>
          <p>
            Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla aliquet. Pellentesque auctor vehicula
            malesuada. Aliquam id feugiat sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula metus
            ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac enim vel felis pharetra laoreet. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Pellentesque hendrerit ac augue quis pretium.
          </p>
          <p>
            Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique, elit metus efficitur elit, ac pretium
            sapien nisl nec ante. In et ex ultricies, mollis mi in, euismod dolor.
          </p>
          <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
          <p>
            Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo
            venenatis. Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
          </p>
          <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
          <p>
            Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra leo vitae tristique rutrum. Donec ut
            volutpat ante, ut suscipit leo.
          </p>
          <h2>Sub-header</h2>
          <p>
            Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla aliquet. Pellentesque auctor vehicula
            malesuada. Aliquam id feugiat sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula metus
            ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac enim vel felis pharetra laoreet. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Pellentesque hendrerit ac augue quis pretium.
          </p>
          <p>
            Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique, elit metus efficitur elit, ac pretium
            sapien nisl nec ante. In et ex ultricies, mollis mi in, euismod dolor.
          </p>
          <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        </article>
      </>
      {/* <About page={page}></About> */}
    </div>
  )
}

export default AppAbout

function About({ page }: { page: number }) {
  const navigate = useNavigate()
  const [pageTitle] = useState('laoer536-About Page')
  const { num, changeNum } = useUserStore()
  // const [context] = useState(() => {
  //   return new User();
  // })

  return (
    <div className="about">
      关于界面123
      <h1>{pageTitle}</h1>
      <h2>userSore.num:{num}</h2>
      <motion.button
        {...button}
        onClick={changeNum}
        className="box"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        click on the store provided by zustand to change the number
      </motion.button>
      <br />
      <br />
      <div>{page}</div>
      {/* <div>{context.name}</div> */}
      <motion.button {...button} onClick={() => navigate(-1)}>
        back
      </motion.button>
      <Button
        shape="rectangle"
        size="medium"
        type="button"
        variant="base"
        onClick={() => {
          // document.documentElement.setAttribute('theme-mode', 'dark')
        }}
        className={`${import.meta.env.VITE_PUBLIC_PREFIX}-container`}
      >
        确定
      </Button>
      <h1 className={'title'}>登录到</h1>
    </div>
  )
}
