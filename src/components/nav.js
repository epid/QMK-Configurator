import React, { Component } from 'react'
import {
  Menu,
  Container,
  Header,
  Button,
  Dropdown,
  Image,
  Icon,
  Modal,
  Input,
  Table,
  Loader
} from 'semantic-ui-react'
import Layouts from './layouts'
import { config } from '../data/config'
import { isElectron } from '../utils/env'
import logo from '../logo.png'

export default class extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false,
      name: ''
    }
  }

  render() {
    const {
      fixed,
      boards,
      activeBoard,
      activeLayout,
      layouts,
      layers,
      dirty,
      selectBoard,
      newLayout,
      selectLayout,
      deleteLayout,
      cloneLayout,
      newLayer,
      importLayer,
      importLayout,
      exportLayout,
      save,
      download,
      flash,
      buildInProgress
    } = this.props
    const { name, open } = this.state

    return (
      <Menu inverted fixed='top' style={{
        margin: 0,
        WebkitAppRegion: 'drag'
      }}>
        <Container>

          <Menu.Item as='div'>
            <Image size='mini' src={logo} style={{ marginRight: '1.5em', filter: 'brightness(10)' }} />
          </Menu.Item>

          <Menu.Menu position='right'>
            <Dropdown
              item
              closeOnBlur
              text={config[activeBoard].config.product}>
              <Dropdown.Menu>
                {boards.map(b => {
                  return (
                    <Dropdown.Item
                      key={b}
                      value={b}
                      onClick={selectBoard}>
                      {config[b].config.product}
                    </Dropdown.Item>
                  )
                })}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
              <Button
                inverted
                color={dirty ? 'green' : 'teal'}
                disabled={buildInProgress}
                onClick={dirty ? save : isElectron() ? flash : download}
                style={{ cursor: 'pointer' }}>
                  {dirty ? 'Save' : buildInProgress ? <Loader inverted inline active size='mini' /> : isElectron() ? 'Flash' : 'Download'}
                </Button>
            </Menu.Item>
            <Menu.Item>
              <Layouts
                layouts={layouts}
                activeLayout={activeLayout}
                newLayout={newLayout}
                activeBoard={activeBoard}
                selectLayout={selectLayout}
                cloneLayout={cloneLayout}
                deleteLayout={deleteLayout}
                importLayout={importLayout}
                exportLayout={exportLayout}
              />
            </Menu.Item>
            <Menu.Item>
              <Modal basic open={open} size='small' trigger={
                <Button
                  icon
                  inverted
                  basic
                  color='green'
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.setState({ open: true })}>
                  <Icon name='plus' />
                </Button>
              }>
                <Header content={`New Layout or Layer for ${config[activeBoard].config.product}`} textAlign='center' style={{ marginTop: 50 }} />
                <Modal.Content>
                  <div style={{ position: 'absolute', right: '1rem', top: 0 }}>
                    <Button
                      icon
                      inverted
                      basic
                      color='red'
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.setState({ open: false, name: '' })}>
                      <Icon name='close' />
                    </Button>
                  </div>
                  <Table inverted>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <Input
                            fluid
                            inverted
                            transparent
                            onChange={(e, data) => { this.setState({ name: data.value }) }}
                            placeholder='Enter a name'
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    inverted
                    color='olive'
                    onClick={() => {
                      importLayer()
                    }}>
                    <Icon name='download' /> Import Layer
                  </Button>
                  <Button
                    basic
                    inverted
                    color='yellow'
                    onClick={() => {
                      importLayout()
                    }}>
                    <Icon name='download' /> Import Layout
                  </Button>
                  <Button
                    basic
                    color='grey'
                    inverted
                    onClick={() => {
                      newLayout(name)
                      this.setState({ name: '', open: false })
                  }}>
                    <Icon name='keyboard outline' /> Create Layout
                  </Button>
                  <Button
                    basic
                    disabled={layers.length >= 16}
                    color='teal'
                    inverted
                    onClick={() => {
                      newLayer(name)
                      this.setState({ name: '', open: false })
                  }}>
                    <Icon name='sticky note outline' /> Create Layer
                  </Button>
                </Modal.Actions>
              </Modal>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}
