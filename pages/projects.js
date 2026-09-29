import Meta from '../components/Meta'
import ProjectCards from '../components/ProjectCards'
export default function Projects() {
  return (
    <>
      <Meta title='项目' />
      <header className='page-heading'>
        <span className='eyebrow'>THE WORKSHOP</span>
        <h1>想法的另一种形状。</h1>
        <p>一些工具，一些实验，以及单纯因为好奇而做的小东西。</p>
      </header>
      <ProjectCards all />
      <div className='page-endnote'>持续构建中。新的探索会在这里更新。</div>
    </>
  )
}
