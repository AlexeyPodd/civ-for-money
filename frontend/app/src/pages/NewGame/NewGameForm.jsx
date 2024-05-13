import { Button, Flex, FormControl, FormLabel, Input, FormErrorMessage, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Stack, Checkbox, Textarea } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';

export default function NewGameForm() {
  const fields = ['title', 'game', 'bet', 'betDenomination', 'playPeriod', 'playPeriodType', 'rules', 'rulesTitle', 'rulesDescription']

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const rulesAreNew = watch('rules', 'create') === 'create';

  async function deploySmartContract(formData) {
    console.log(formData);
  }

  return (
    <Flex justify='center'>
      <form onSubmit={handleSubmit(deploySmartContract)}>

        <FormControl isRequired isInvalid={errors && errors['title']} my="20px">
          <FormLabel>Title</FormLabel>
          <Input {...register('title')} focusBorderColor='#48BB78' />
          <FormErrorMessage>{errors['title']}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors && errors['game']} my="20px">
          <FormLabel>Game</FormLabel>
          <Select {...register('game')}>
            <option value="CIV5" >Civilization 5</option>
          </Select>
          <FormErrorMessage>{errors['game']}</FormErrorMessage>
        </FormControl>

        <Stack shouldWrapChildren direction='row' my="20px" w='100%'>
          <FormControl isRequired isInvalid={errors && errors['bet']}>
            <FormLabel>Bet</FormLabel>
            <NumberInput defaultValue={0.0005} focusBorderColor='#48BB78'>
              <NumberInputField {...register('bet')} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors['title']}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Denomination</FormLabel>
            <Select {...register('betDenomination')}>
              <option value="0">Wei</option>
              <option value="3">Kwei</option>
              <option value="6">Mwei</option>
              <option value="9" >Gwei</option>
              <option value="12">Szabo</option>
              <option value="15">Finney</option>
              <option value="18">Ether</option>
              <option value="21">KEther</option>
              <option value="24">MEther</option>
              <option value="27">GEther</option>
              <option value="30">TEther</option>
            </Select>
            <FormErrorMessage>{errors['game']}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack shouldWrapChildren direction='row' my="20px">
          <FormControl isRequired isInvalid={errors && errors['bet']}>
            <FormLabel>Game Duration</FormLabel>
            <NumberInput defaultValue={1} focusBorderColor='#48BB78'>
              <NumberInputField {...register('playPeriod')} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors['playPeriod']}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Days / Hours</FormLabel>
            <Select {...register('playPeriodType')}>
              <option value="3600">hour(s)</option>
              <option value="86400">day(s)</option>
            </Select>
            <FormErrorMessage>{errors['game']}</FormErrorMessage>
          </FormControl>
        </Stack>

        <FormControl isRequired isInvalid={errors && errors['rules']} my="20px">
          <FormLabel>Rules</FormLabel>
          <Select {...register('rules')}>
            <option value="create">Create new</option>
            <option value="1">pangea</option>
            <option value="2">sqirmish</option>
            <option value="3">islands</option>
          </Select>
          <FormErrorMessage>{errors['game']}</FormErrorMessage>
        </FormControl>

        {!rulesAreNew
          && <Flex><Button size="xs" colorScheme="red" ml='auto'>Delete this rules</Button></Flex>
        }

        <FormControl isRequired isInvalid={errors && errors['rulesTitle']} my="20px">
          <Input {...register('rulesTitle')} focusBorderColor='#48BB78' size='sm' placeholder="Rules Title" variant="flushed" />
          <FormErrorMessage>{errors['rulesTitle']}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={errors && errors['rulesDescription']} my="20px">
          <Textarea {...register('rulesDescription')} focusBorderColor='#48BB78' size='sm' placeholder="Rules description..." />
          <FormErrorMessage>{errors['rulesDescription']}</FormErrorMessage>
        </FormControl>

        <Button
          w='100%'
          size='lg'
          colorScheme="orange"
          type='submit'
        >
          Deploy
        </Button>

      </form>
    </Flex>
  )
}
