// Native
import os from 'os'

// Packages
import electron from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import setRef from 'react-refs'

// Styles
import styles from '../styles/components/title'

// Components
import Done from '../vectors/done'
import Deploy from '../vectors/deploy'
import Filter from '../vectors/filter'
import Search from './feed/search'

class Title extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      updateMessage: false,
      typeFilter: false,
      filteredType: 'team'
    }

    this.setReference = setRef.bind(this)

    this.selectToDeploy = this.selectToDeploy.bind(this)
    this.hideDeployIcon = this.hideDeployIcon.bind(this)
    this.showDeployIcon = this.showDeployIcon.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  componentDidMount() {
    const remote = electron.remote || false

    if (!remote) {
      return
    }

    this.dialogs = remote.require('./dialogs')
  }

  selectToDeploy() {
    this.dialogs.deploy()
  }

  hideDeployIcon() {
    this.deployIcon.classList.add('hidden')
  }

  showDeployIcon() {
    this.deployIcon.classList.remove('hidden')
  }

  toggleFilter() {
    this.setState({
      typeFilter: !this.state.typeFilter
    })
  }

  scopeUpdated() {
    if (this.state.updateMessage) {
      return
    }

    this.setState({
      updateMessage: true
    })

    setTimeout(() => {
      this.setState({
        updateMessage: false
      })
    }, 1000)
  }

  updateTypeFilter(type) {
    if (type === this.state.filteredType) {
      return
    }

    const { setTypeFilter } = this.props

    if (setTypeFilter) {
      setTypeFilter(type)
    }

    this.setState({ filteredType: type })
  }

  renderTypeFilter() {
    const types = ['Me', 'Team', 'System']
    const { isUser } = this.props
    const { filteredType } = this.state

    if (isUser) {
      types.splice(1, 1)
    }

    return (
      <section className="filter">
        <nav>
          {types.map((item, index) => {
            const classes = []
            const handle = item.toLowerCase()

            if (filteredType === handle) {
              classes.push('active')
            }

            if (isUser && filteredType === 'team' && index === 0) {
              classes.push('active')
            }

            return (
              <a
                className={classes.join(' ')}
                key={item}
                onClick={this.updateTypeFilter.bind(this, handle)}
              >
                {item}
              </a>
            )
          })}
        </nav>

        <style jsx>
          {styles}
        </style>
      </section>
    )
  }

  render() {
    const classes = []

    if (this.props.light) {
      classes.push('light')
    }

    if (os.platform() === 'win32') {
      classes.push('windows')
    }

    if (this.state.updateMessage) {
      classes.push('scope-updated')
    }

    if (this.state.typeFilter) {
      classes.push('filter-visible')
    }

    return (
      <aside className={classes.join(' ')}>
        <div>
          {this.props.light &&
            this.props.searchShown &&
            <Search
              hideDeployIcon={this.hideDeployIcon}
              showDeployIcon={this.showDeployIcon}
              setFeedFilter={this.props.setFilter || false}
              setSearchRef={this.props.setSearchRef || false}
            />}

          <h1>
            {this.props.children}
          </h1>

          {this.props.light &&
            this.props.searchShown &&
            <span className="toggle-filter" onClick={this.toggleFilter}>
              <Filter />
            </span>}

          {this.props.light &&
            <span
              className="deploy"
              onClick={this.selectToDeploy}
              ref={this.setReference}
              name="deployIcon"
            >
              <Deploy />
            </span>}
        </div>

        <section className="update-message">
          <Done />
          <p>Context updated for Now CLI!</p>
        </section>

        {this.renderTypeFilter()}

        <style jsx>
          {styles}
        </style>
      </aside>
    )
  }
}

Title.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element.isRequired
  ]),
  light: PropTypes.bool,
  setFilter: PropTypes.func,
  setSearchRef: PropTypes.func,
  searchShown: PropTypes.bool,
  setTypeFilter: PropTypes.func,
  isUser: PropTypes.bool
}

export default Title
