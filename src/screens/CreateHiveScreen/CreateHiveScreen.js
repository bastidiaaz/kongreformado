import React from 'react';
import {
  Button,
  ScrollView,
  Text,
  ToastAndroid,
  View
} from 'react-native';
import t from 'tcomb-form-native';
import DEFAULTS from '../../utils/constants';
import { createHive } from '../../reducers/hivesReducer/hivesActions';
import { connect } from 'react-redux';
import styles from './styles';

const Form = t.form.Form;
const Hive = t.struct({
  name: t.String,
  description: t.maybe(t.String)
});
const formOptions = {
  fields: {
    name: {
      label: 'Nombre *',
      placeholder: 'Ingresa un nombre para tu colmena'
    },
    description: {
      label: 'Descripción',
      placeholder: 'Ingresa una descripción para tu colmena'
    }
  }
}

class CreateHiveScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValue: null
    };
  };

  onFormChange = (formValue) => {
    this.setState({
      formValue: formValue
    });
  };

  createHive = () => {
    var newHiveForm = this.refs.newHive;
    var formIsValid = !newHiveForm.validate().errors.length > 0;

    if (formIsValid) {
      var newHiveValues = newHiveForm.getValue();
      var newHive = {
        name: newHiveValues.name,
        description: newHiveValues.description,
        apiary: this.props.navigation.getParam('apiary').name
      };

      this.props.createHive(newHive.apiary, newHive, () => {
        this.props.navigation.goBack();
        ToastAndroid.show('Colmena creada', ToastAndroid.SHORT);
      });
    } else {
      ToastAndroid.show('Debe llenar los campos obligatorios', ToastAndroid.SHORT);
      console.log('Form invalid');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.formContainer}>
          <View>
            <Form value={this.state.formValue} onChange={this.onFormChange} ref="newHive" type={Hive} options={formOptions}/>
          </View>
        </ScrollView>
        <View style={{height: 35}}>
          <Button color={DEFAULTS.PRIMARY_COLOR_DARK} onPress={this.createHive} title="CREAR COLMENA" />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hives: state.hives
});

export default connect(mapStateToProps, { createHive })(CreateHiveScreen);
