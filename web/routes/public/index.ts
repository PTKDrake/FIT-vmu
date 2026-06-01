import pages from './pages'
import posts from './posts'
import categories from './categories'

const publicMethod = {
    pages: Object.assign(pages, pages),
    posts: Object.assign(posts, posts),
    categories: Object.assign(categories, categories),
}

export default publicMethod