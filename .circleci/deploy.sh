#!/bin/bash -e

deploy () { 
ssh -p $SSH_PORT -T $SSH_USER@$SSH_HOST <<EOA
ssh $SSH_NESTED_HOST <<EOB
    echo "### Deployment started"
    if [ -d "$BASE_PATH/$CIRCLE_PROJECT_REPONAME-$CIRCLE_BRANCH" ]; then
        cd $BASE_PATH/$CIRCLE_PROJECT_REPONAME-$CIRCLE_BRANCH && \
        git fetch && \
        git checkout $CIRCLE_BRANCH && \
        git pull && \
        docker-compose -f docker-compose.$CIRCLE_BRANCH.yml up -d --build

    else
        cd $BASE_PATH
        git clone $CIRCLE_REPOSITORY_URL $CIRCLE_PROJECT_REPONAME-$CIRCLE_BRANCH && \
        cd $CIRCLE_PROJECT_REPONAME-$CIRCLE_BRANCH && \
        git checkout $CIRCLE_BRANCH && \
        git pull && \
        docker-compose -f docker-compose.$CIRCLE_BRANCH.yml up -d --build
    fi
EOB
EOA
}

SSH_PORT_TMP=SSH_PORT_$CIRCLE_BRANCH
SSH_PORT=${!SSH_PORT_TMP}
SSH_USER_TMP=SSH_USER_$CIRCLE_BRANCH
SSH_USER=${!SSH_USER_TMP}
SSH_HOST_TMP=SSH_HOST_$CIRCLE_BRANCH
SSH_HOST=${!SSH_HOST_TMP}

SSH_NESTED_HOST_TMP=SSH_NESTED_HOST_$CIRCLE_BRANCH
SSH_NESTED_HOST=${!SSH_NESTED_HOST_TMP}

deploy