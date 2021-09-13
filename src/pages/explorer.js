import React from 'react';
import Header from '../components/header.js';
import  World from '../3Dworld/world';
import {
  goToMarkerControl,
  controlsWrapper,
  togglePlayPause,
  sceneContainer,
  paneTextContent,
  headerCustom} from "./explorer.module.css";
import { MdPause, MdPlayArrow, } from 'react-icons/md';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import ecrouPict from '../images/3Dfocus/ecrou.jpg';
import tonneauPict from '../images/3Dfocus/tonneau.jpg';
import charpentePict from '../images/3Dfocus/charpente.jpg';
import visPict from '../images/3Dfocus/vis.jpg';
import maiePict from '../images/3Dfocus/maie.jpg';
import arrierePict from '../images/3Dfocus/arriere.jpg';
import IdleLogout from '../components/IdleLogout.js';


class ThreeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLooping : true,
    };
  };


  toogleLoop = () => {
    this.setState((prevState) => ({isLooping: !prevState.isLooping}));
    this.state.isLooping? this.world.pausePressAnimation() : this.world.resumePressAnimation();
  };


  resetCam = () => {
    this.world.resetCam();
  };

  goTo = (poiId) => {
    this.world.goTo(poiId);
    this.props.triggerPane(poiId);
  };

  renderGoToButtons() {
    let buttons = []
    for (const id in this.props.poisData) {
      const poiData = this.props.poisData[id];
      buttons.push(
        <button 
          key={id} 
          id={poiData.name} 
          className = {goToMarkerControl}  
          onClick={() => this.goTo(id)}>
          {poiData.buttonName ? poiData.buttonName : poiData.name}
        </button>
        );
    };
    return(buttons);
  }

  handleClickedPoi(poiId) {
    this.world.goTo(poiId);
    this.props.triggerPane(poiId);
  }

  async componentDidMount() {
    const callback = (clickedPoiId) => {
      this.handleClickedPoi(clickedPoiId)
    };
    const sceneContainer = document.querySelector('#scene-container');
    this.world = new World(sceneContainer, this.props.poisData, callback);
    await this.world.init();//#TODO error handling with async react app
    this.world.start();
  };

  componentWillUnmount() {
    this.world.stop();
  }

  render() {
    return (
      <div className={controlsWrapper}>
        <button className = {togglePlayPause} onClick={this.toogleLoop}>{this.state.isLooping ? <MdPause size='1.5x'/> : <MdPlayArrow size='1.5x'/>}</button>
        <button className = {goToMarkerControl}  onClick={this.resetCam}>Vue d'ensemble</button>
        {this.renderGoToButtons()}
      </div>
    );
  }
}




class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaneOpen: false,
      currentPoiId : 'barrique',
    };
    this.poisData = {
      //point of interest with position to be created in the 3D wiew
      'barrique': {
        name: 'Barrique',
        position: [-3.1, 0.5, -1.63],
        shortDescription: 'Barrique en bois',
        content: `Le moût n'a été en contact qu'avec des parties en bois : c'est nécessaire pour sa qualité. Le contact avec du métal pourrait produire de l'oxyde ferrique.`,
        image: tonneauPict,
      },
      'datation': {
        name: 'Datation',
        position: [-3.8, 0.65, 0],
        shortDescription: 'Marque de datation par dendochronologie',
        content: `Aviez-vous remarqué ces petites réparations dans le bois ? Ce sont les marques laissées par des prélèvement qui ont servi à dater le pressoir. La technique de datation des bois s'appelle la dendochronologie. Ainsi on sait que le pressoir du musée date de 1850 environ.`,
        image: tonneauPict,
      },
      'ecrou': {
        name: 'Écrou',
        position: [-0.16, 1.8, -3.2],
        shortDescription: 'La vis et l\'écrou chantent sous l\'effort.',
        content: `En action, chargé, le pressoir "parle" lorsque la vis en bois tourne : elle frotte sur l'écrou. Chaque pressoir a une vis, un écrou et donc une "voix" différente.`,
        image: ecrouPict,
      },
      'barre': {
        name: 'Barre',
        position: [-0.16, 1, -3.2],
        shortDescription: 'Il faut de la force pour tourner la barre',
        content: `La barre est en frêne, il faut 2 personnes fortes pour la faire tourner et presser le cep. Avec une vis en acier c'est plus facile: en effet il y a moins de frottement et on peut faire des pas de vis plus fin.`,
        image: ecrouPict,
      },
      'vis': {
        name: 'Vis',
        position: [-0.1, 2.6, -3.05] ,
        shortDescription: 'La dernière vis en bois',
        content: `Le pressoir du musée est le dernier à conserver sa vis en bois.
        La vis en bois est soumise à de fortes pressions de torsion. C'est pourquoi on utilise du cormier, du frêne ou du chataignier comme ici.
        La vis peut casser : progressivement les vis en bois sont remplacées par des pièces en métal, davantage manipulalables et compactes.
        Le remplacement des vis en bois par des vis en métal aurait permis de raccourcir les fûts.
        `,
        image: visPict,
      },
      'bois': {
        name: 'Charpenterie',
        position: [-1.4, 0.95, 0.9],
        shortDescription: 'Les pressoirs sont construits en chêne.',
        content: `Les pressoirs sont construits par des charpentiers, avec des chênes locaux. Il fallait 5 à 6 chênes pour faire un grand pressoir.
        Sur ce pressoir tous les assemblages sont en bois: tenons, mortaises, chevilles.`,
        image: charpentePict,
      },
      'maie':{
        name: 'Étanchétité',
        position: [-2.25, 0.65, 0],
        shortDescription: 'La maie doit être étanche.',
        content: `Les maies sont assemblées de façon précise par les charpentiers. On peut observer les marques d'assemblage.
        Avant les vendanges, ils réparent et resserrent les pièces si nécessaire.
        Ils renforcent aussi l'étanchéité des maies, en utilisant des joints en jonc ou en terre glaise.`,
        image: maiePict,
      },
      'maie2':{
        name: 'Anche arrière',
        position: [1.2, 0.8, -0.7],
        shortDescription: 'Une seconde maie pour travailler plus vite',
        content: `Tandis qu'à l'avant, sur la maie de foulage on extrait un premier moût (jus) avec les pieds, à l'arrière sur la maie de pressage, on presse le cep déjà foulé. 
        A l'avant, la maie de foulage prepare donc le cep pour une prochaine pressée, peut-être destinée à un second pressoir, comme c'est le cas dans les grandes exploitations.`,
        image: arrierePict,
      },
    };
  };



  triggerPane = (poiId) => {
    this.setState({ 
      isPaneOpen: true,
      currentPoiId: poiId,
    });
  }

  render() {
    const title = 'Explorer le long-fût du musée';
    const currentPoi = this.poisData[this.state.currentPoiId];
    return (
      <React.Fragment>
        <title>{title}</title>
        <Header className = {headerCustom} headerText = {title}/>
        <IdleLogout logoutDelay = '15' warnDelay = '10' />
        <div className={sceneContainer} id='scene-container'></div>
        <ThreeScene 
          poisData = {this.poisData} 
          triggerPane = {(poiId) => this.triggerPane(poiId)} 
        />

        <SlidingPane 
          //className={slidePane}
          isOpen={this.state.isPaneOpen}
          title={currentPoi.name}
          subtitle={currentPoi.shortDescription}
          width="400px"
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            this.setState({ isPaneOpen: false });
          }}
          >
          <div className = {paneTextContent}>{currentPoi.content}</div>
          <img alt = {currentPoi.name} src = {currentPoi.image}/>
        </SlidingPane>
      </React.Fragment>
    )
  }
}


export default Explorer