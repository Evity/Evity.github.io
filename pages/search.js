import Articles from './articles'
export default function Search(props) {
  return <Articles {...props} search />
}
export { getStaticProps } from './index'
