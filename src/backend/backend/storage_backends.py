from storages.backends.s3boto3 import S3Boto3Storage

class MediaStorage(S3Boto3Storage):
    location = 'pictures'
    file_overwrite = True
    # default_acl = 'public-read'