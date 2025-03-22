# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AiDiagnoses(models.Model):
    id = models.UUIDField(primary_key=True)
    symptom = models.ForeignKey('Symptoms', models.DO_NOTHING)
    ai_response = models.TextField()
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ai_diagnoses'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Chats(models.Model):
    id = models.UUIDField(primary_key=True)
    patient = models.ForeignKey('Patients', models.DO_NOTHING)
    clinician = models.ForeignKey('Clinicians', models.DO_NOTHING, blank=True, null=True)
    category = models.ForeignKey('QueryCategories', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chats'


class ClinicianVerdicts(models.Model):
    id = models.UUIDField(primary_key=True)
    ai_diagnosis = models.ForeignKey(AiDiagnoses, models.DO_NOTHING)
    clinician = models.ForeignKey('Clinicians', models.DO_NOTHING)
    final_verdict = models.TextField()
    approved_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clinician_verdicts'


class Clinicians(models.Model):
    id = models.OneToOneField('Users', models.DO_NOTHING, db_column='id', primary_key=True)
    specialization = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    verified = models.BooleanField(blank=True, null=True)
    hospital = models.ForeignKey('Hospital', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'clinicians'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Hospital(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospital'


class Messages(models.Model):
    id = models.UUIDField(primary_key=True)
    chat = models.ForeignKey(Chats, models.DO_NOTHING)
    sender = models.ForeignKey('Users', models.DO_NOTHING)
    message = models.TextField(blank=True, null=True)
    message_type = models.CharField(max_length=50)
    media_url = models.CharField(max_length=500, blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'messages'


class Notifications(models.Model):
    id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    chat = models.ForeignKey(Chats, models.DO_NOTHING)
    message = models.ForeignKey(Messages, models.DO_NOTHING, blank=True, null=True)
    message_0 = models.TextField(db_column='message')  # Field renamed because of name conflict.
    read_status = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class Patients(models.Model):
    id = models.OneToOneField('Users', models.DO_NOTHING, db_column='id', primary_key=True)
    age = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    allergies = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'patients'


class QueryCategories(models.Model):
    id = models.UUIDField(primary_key=True)
    category_name = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'query_categories'


class Symptoms(models.Model):
    id = models.UUIDField(primary_key=True)
    patient = models.ForeignKey(Patients, models.DO_NOTHING)
    description = models.TextField(blank=True, null=True)
    symptom_type = models.CharField(max_length=50)
    media_url = models.CharField(max_length=500, blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'symptoms'


class Users(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=1000)
    role = models.CharField(max_length=50)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
class Chat(models.Model):
    user_input = models.TextField()
    bot_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_input[:50]



