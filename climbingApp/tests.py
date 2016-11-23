"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

import datetime
from django.contrib.auth.models import User
from django.test import TestCase
from tastypie.test import ResourceTestCaseMixin

from .models import *


class GymResourceTest(ResourceTestCaseMixin, TestCase):
  fixtures = ['test_climbingapp_test.json',
              'test_users']

  def setUp(self):
    super(GymResourceTest, self).setUp()

    self.post_data = {
      'name': 'Gym 3'
    }

    self.put_data = {
      'name': 'Gym 4'
    }

  def get_super_credentials(self):
    return self.create_apikey("super", "46b8b54f3155b51393b61d95580e588ddd47e77d")

  def get_other_credentials(self):
    return self.create_apikey("other", "46b8b54f3155b51393b61d95580e588ddd47e77d")

  def test_get_list_unauthenticate(self):
    response = self.api_client.get('/api/v1/gyms/', format='json')
    self.assertHttpOK(response)

    data = self.deserialize(response)
    self.assertEquals(len(data['objects']), 2)

  def test_get_detail_unauthenticated(self):
    response = self.api_client.get('/api/v1/gyms/1/', format = 'json')
    self.assertHttpOK(response)

    data = self.deserialize(response)
    data['name'] = 'Gym 1'

  def test_post_list_unauthenticated(self):
    response = self.api_client.post('/api/v1/gyms/', format='json', data=self.post_data)
    self.assertHttpUnauthorized(response)

  def test_post_list_unauthorized(self):
    response = self.api_client.post('/api/v1/gyms/', format='json', data=self.post_data,
      authentication = self.get_other_credentials() 
    )
    self.assertHttpUnauthorized(response)

  def test_post_list_authenticated(self):
    self.assertEquals(Gym.objects.count(), 2)

    response = self.api_client.post('/api/v1/gyms/', format='json', data=self.post_data, 
      authentication=self.get_super_credentials())
    self.assertHttpCreated(response)

    self.assertEquals(Gym.objects.count(), 3)

    data = self.deserialize(response)
    self.assertEquals(data['sort_name'], 'GYM_3')
  
  def test_put_detail_unauthenticated(self):
    response = self.api_client.put('/api/v1/gyms/1/', format='json', data=self.put_data)
    self.assertHttpUnauthorized(response)

  def test_put_detail_unauthorized(self):
    response = self.api_client.put('/api/v1/gyms/1/', format='json', data=self.put_data,
      authentication = self.get_other_credentials() 
    )
    self.assertHttpUnauthorized(response)

  def test_put_detail(self):
    pass

  def test_delete_detail_unauthenticated(self):
    response = self.api_client.delete('/api/v1/gyms/1/')
    self.assertHttpUnauthorized(response)

  def test_delete_detail_unauthorized(self):
    response = self.api_client.delete('/api/v1/gyms/1/',
      authentication = self.get_other_credentials() 
    )
    self.assertHttpUnauthorized(response)

  def test_delete_detail_with_walls(self):
    response = self.api_client.delete('/api/v1/gyms/1/',
      authentication = self.get_super_credentials()
    )
    self.assertHttpAccepted(response)

  def test_delete_detail_without_walls(self):
    response = self.api_client.delete('/api/v1/gyms/2/',
      authentication = self.get_super_credentials()
    )
    self.assertHttpAccepted(response)


class UserResourceTest(ResourceTestCaseMixin, TestCase):
  fixtures = ['test_climbingapp_test.json',
              'test_users']

  def setUp(self):
    super(UserResourceTest, self).setUp()
    self.put_data = {
      
    }

  def get_super_credentials(self):
    return self.create_apikey("super", "46b8b54f3155b51393b61d95580e588ddd47e77d")

  def get_other_credentials(self):
    return self.create_apikey("other", "46b8b54f3155b51393b61d95580e588ddd47e77d")

  def test_get_list(self):
    response = self.api_client.get('/api/v1/users/', format = 'json')
    self.assertHttpOK(response)

    data = self.deserialize(response)
    self.assertEquals(len(data['objects']), 2)

  def test_post_list(self):
    response = self.api_client.post('/api/v1/users/', format = 'json',
      authentication = self.get_super_credentials() 
    )
    self.assertHttpNotImplemented(response)

  def test_put_detail_unauthenticated(self):
    response = self.api_client.put('/api/v1/users/1/', format = 'json',
      data = self.put_data,
    )
    self.assertHttpUnauthorized(response)

  def test_put_detail_self(self):
    response = self.api_client.put('/api/v1/users/2/', format = 'json',
      authentication = self.get_other_credentials(),
      data = self.put_data,
    )
    self.assertHttpOK(response)

  def test_put_detail_as_super(self):
    response = self.api_client.put('/api/v1/users/2/', format = 'json',
      authentication = self.get_other_credentials(),
      data = self.put_data,
    )
    self.assertHttpOK(response)

  def test_delete_detail(self):
    response = self.api_client.delete('/api/v1/users/1/', format = 'json',
      authentication = self.get_super_credentials(),
    )
    self.assertHttpAccepted(response)
    pass
