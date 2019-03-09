const AWS = require('aws-sdk');

const wrappedIsEBLeaderInstance = region => {
  AWS.config.update({ region });
  const opts = {
    credentials: new AWS.EC2MetadataCredentials()
  };
  const elasticbeanstalk = new AWS.ElasticBeanstalk(opts);
  const ec2 = new AWS.EC2(opts);
  const metadata = new AWS.MetadataService(opts);
  return (isEBLeaderInstance = () =>
    Promise((resolve, reject) =>
      metadata.request('/latest/meta-data/instance-id', (err, InstanceId) =>
        err ? reject(err) : resolve(InstanceId)
      )
    ).then(currentInstanceId => {
      const params = {
        Filters: [
          {
            Name: 'resource-id',
            Values: [currentInstanceId]
          }
        ]
      };
      return Promise((resolve, reject) =>
        ec2.describeTags(params, (err, data) => {
          if (err) {
            return reject(err);
          }
          const envIdTag = data.Tags.find(
            t => t.Key === 'elasticbeanstalk:environment-id'
          );
          if (envIdTag === null) {
            return reject(
              'Failed to find the value of "elasticbeanstalk:environment-id" tag.'
            );
          }
          elasticbeanstalk.describeEnvironmentResources(
            { EnvironmentId: envIdTag.Value },
            (err, data) =>
              err
                ? reject(err)
                : resolve(
                    currentInstanceId ===
                      data.EnvironmentResources.Instances[0].Id
                  )
          );
        })
      );
    }));
};

module.exports = wrappedIsEBLeaderInstance;
