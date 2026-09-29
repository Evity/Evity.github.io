import { projects } from '../lib/site'
import { Arrow } from './Icons'
export function ProjectArt({ project }) {
  return (
    <div className={`project-art art-${project.id}`} aria-hidden='true'>
      <span className='art-number'>{project.number} / EXPLORATIONS</span>
      {project.id === 'coffee' ? (
        <div className='coffee-art'>
          <i />
          <span>
            COFFEE
            <br />
            ATLAS
          </span>
          <small>ORIGIN → FLAVOUR</small>
        </div>
      ) : project.id === 'nixie' ? (
        <div className='nixie-art'>
          {['0', '6', ':', '2', '8'].map((n, i) => (
            <span key={i}>{n}</span>
          ))}
        </div>
      ) : project.id === 'senslab' ? (
        <div className='senslab-art'>
          <i />
          <i />
          <i />
          <span>
            +<small>FIND YOUR FEEL.</small>
          </span>
        </div>
      ) : (
        <div className='rain-art'>
          <span>
            雨宿り<small>OPEN ALL NIGHT</small>
          </span>
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  )
}
export default function ProjectCards({ all = false }) {
  return (
    <div className={`project-grid ${all ? 'all-projects' : ''}`}>
      {projects.slice(0, all ? undefined : 3).map(project => (
        <a
          href={project.url}
          target='_blank'
          rel='noreferrer'
          className='project-card'
          key={project.id}
        >
          <ProjectArt project={project} />
          <div className='project-info'>
            <span className='eyebrow'>{project.category}</span>
            <h3>
              {project.title}
              <Arrow diagonal />
            </h3>
            <p>{project.description}</p>
            <span className='project-cta'>{project.label} ↗</span>
          </div>
        </a>
      ))}
    </div>
  )
}
